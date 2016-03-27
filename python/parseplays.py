import urllib2
import pickle
import os.path
import json
import misc
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from HDOrderedDict import HDOrderedDict
import pprint

def main():
    today = (datetime.now() - timedelta(hours=11)).strftime('%Y-%m-%d')
    plays = getAllPlaysForDate('2016-03-18')

    jPlays = json.dumps(plays)

    f = open('../plays.json','w')
    f.write(jPlays)
    f.close()

def getAllPlaysForDate(date):
    #First get all of the game ids that we care about.
    sched = misc.getPickleData('schedule.p') #Dict = date -> [gameid : matchup]
    
    gameids = sched[date].keys()

    #Master list of plays.
    allPlays = misc.getPickleData('temp/plays' + date + '.p')
    if allPlays is None: #New day, instantiate empty dict
        allPlays = HDOrderedDict()

    #Do the responsible thing, stop checking pages where the game is already over
    for key, play in allPlays.iteritems():
        if play['event'] == 'GEND': #Game End
            gameids.remove(play['gameid'])

    #Check games still running.
    for gameid in gameids:
        plays = getPlaysOnPage(gameid)
        if plays is not None:
            #Run through each play, see if anything has changed.
            for key, play in plays.iteritems():
                if key not in allPlays: #If we haven't seen this play, add it at the top
                    play['meta'] = calcPlayMeta(play.copy())
                    allPlays.prepend(key, play)
                else: #If we HAVE seen it, check to see if it has changed.
                    oldPlay = stripPlay(allPlays[key].copy())
                    diff = set(oldPlay.items()) ^ set(stripPlay(play.copy()).items()) #Find any new items
                    if len(diff) > 0: #Something changed, update.
                        play['meta'] = calcPlayMeta(play)
                        allPlays[key] = play #Overwrite everything else.
                    #If no changes, fallthrough and pass over.

    #Just for now, recalc all event meta data.
    for key in allPlays.keys():
        allPlays[key]['meta'] = calcPlayMeta(allPlays[key].copy(), True)
        
    #All done with the plays, pickle the data for later use.
    misc.savePickleData('temp/plays' + date + '.p', allPlays)

    #Return the plays, sorted by insertion date.
    return allPlays.values()

def getPlaysOnPage(gameid):
    url = "http://www.nhl.com/scores/htmlreports/20152016/PL02%s.HTM" % ('%04d' % gameid)
    print 'Fetching', url

    site = None
    try:
        site = urllib2.urlopen(url)
    except urllib2.HTTPError as e:
        print '404 -', url
        return None

    results = HDOrderedDict()
    
    bs = BeautifulSoup(site.read(), 'html.parser')
    rows = bs.findAll('tr', { 'class' : 'evenColor' })

    #We need to track the two teams for later usage.
    try:
        tds = bs.findAll('td', { 'class' : 'heading + bborder' })
        teams = { 'visitor' : tds[-2].string.replace(' On Ice', '').replace('.',''), 
                  'home' : tds[-1].string.replace(' On Ice', '').replace('.','') }
    except:
        print "Essentially 404 - empty stats page."
        return None

    for row in rows:
        cells = row.findChildren('td', {}, None, None)

        vals = {}
        vals['playid'] = str(gameid) + '-' + cells[0].getText() #Play number, unique per season
        vals['gameid'] = gameid                                 #Game number, unique per season
        vals['eventid'] = cells[0].getText()                    #Event number, unique per game
        vals['period'] = cells[1].getText()
        vals['periodOrd'] = misc.getOrdinal(vals['period'])
        vals['strength'] = cells[2].getText().replace(u'\xa0','')
        vals['time'] = cleanTime(cells[3].getText())
        vals['event'] = cells[4].getText()
        vals['desc'] = cells[5].getText().replace(u'\xa0', ' ')
        vals['teams'] = teams
        vals['meta'] = {}

        results[vals['playid']] = vals #Key is the gameid + eventid "0869-24"
        
    return results

def stripPlay(original):
    if 'meta' in original:
        del original['meta']
    return original

def calcPlayMeta(play, recalc=False):
    meta = {}
    if 'created' in play['meta'] and not recalc:
        meta['created'] = play['meta']['created']
        meta['edited'] = misc.getNowString()
    else:
        meta['created'] = misc.getNowString()

    #Calculate extra meta data.
    if play['event'] in ['PSTR','PEND','GEND','SOC']:
        #Parse the time that this event happened.
        time = play['desc'].split(': ')[1]
        meta['eventTime'] = time
    
    if play['event'] == 'STOP':
        #Clean up some text for better appearance.
        cleanText = play['desc']
        for org, repl in [('CHLG', 'CHALLENGE'), ('HM', '(HOME)'), ('VIS ', '(VISITOR) '), ('GOAL INTERFERENCE', 'GOALTENDER INTERFERENCE'), (',', ', ')]:
            cleanText = cleanText.replace(org, repl)
        cleanText = cleanText.capitalize()   #Remove the derp case
        cleanText = cleanText.replace('Tv', 'TV').replace('tv','TV') #Fix TV casing
        meta['cleanText'] = cleanText
    
    #Figure out which team should get "credit" for the action.
    if play['event'] in ['BLOCK', 'FAC', 'GIVE', 'GOAL', 'HIT', 'MISS', 'PENL', 'SHOT', 'TAKE', 'CHL']:
        meta['mainLogo'] = cleanTeamName(play['desc'].split(' ')[0])
        meta['actionPlayers'] = getActionPlayers(play)

    #Get some extra info 
    if play['event'] in ['BLOCK', 'MISS', 'SHOT', 'GOAL', 'PENL', 'GIVE', 'TAKE', 'HIT']:
        meta['extraInfo'] = play['desc'].replace('.','').replace(', ', ',').split(',')[1:]

    #Get some extra info if formatted a diff way.
    if play['event'] in ['PENL']:
        words = play['desc'].split(' ')
        if words[1] != 'TEAM': #Team penalties parsed differently.
            desc = ' '.join(words[3:]) #Kill first 3 words (team & action player), take everything else
        else:
            desc = ' '.join(words[2:]) #Kill first 2 words (team), take everything else

        desc = desc.replace('Zone', 'Zone,').replace(') ','), ') #Add commas after some elements if needed, help the split below.
        info = desc.replace('.','').replace(', ', ',').split(',')

        #Make sure things are in a repeatable order.
        if (len(info) > 1 and 'Served' in info[1]):
            info.insert(2, info.pop(1)) #Swap it

        meta['extraInfo'] = info

    #Challenge info
    if play['event'] in ['CHL']:
        reason = play['desc'].split('-')[1].strip()
        result = play['desc'].split(' ')[-1]
        meta['extraInfo'] = [reason, result]

    #For debug, show us when we get bogus team names.
    if 'mainLogo' in meta and meta['mainLogo'] != meta['mainLogo'].upper():
        print meta['mainLogo'], play

    return meta
    
def cleanTime(txt): #0:0020:00 -> 20:00
    sep = txt.find(':')
    return txt[sep+3:]

def getActionPlayers(play):
    items = play['desc'].replace(',','').replace(';','').split(' ')

    found = []
    for i in range(len(items)):
        if '#' in items[i]:
            #We found a player, let's get their info.
            p = {}
            p['num'] = items[i].replace('#','') #store without the #
            p['name'] = items[i+1].capitalize()
            p['displayName'] = '#' + p['num'] + ' ' + p['name']
            if items[i-1] == '-':
                p['team'] = items[i-3]
            elif items[1] == 'TEAM':
                p['team'] = items[0] #Team penalties are formatted differently
            else:
                p['team'] = items[i-1]

            #If this was a goal, the last two players are broken. NHL reports their format differently.
            if play['event'] == 'GOAL' and len(found) > 0:
                p['team'] = found[0]['team'] #Just copy the team from the first guy. Assists can't go to the other team.

            found.append(p)

    #If only one person was involved for some reason, tack on a "None" at the end in case the app need to show that no one else helped.
    if len(found) == 1:
        found.append({ 'displayName' : 'None' })

    return found

def cleanTeamName(txt):
    txt = txt.replace('.','')
    if txt == 'TB':
        return 'TBL'
    if txt == 'NJ':
        return 'NJD'
    if txt == 'SJ':
        return 'SJS'

    return txt
    
main()
    
