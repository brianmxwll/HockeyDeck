import urllib2
import json
from datetime import datetime, timedelta

def main():
    #Get the simple rosters
    rosters = getAllRosters()
    jRosters = json.dumps(rosters)
    f = open('../rosters.json','w')
    f.write(jRosters)
    f.close()

    #Get all of the statlines.
    if datetime.now().month <= 6: #If this is june or earlier, we want last year + this year
        yearOne = (datetime.now() - timedelta(weeks=52)).year
        yearTwo = datetime.now().year
    else:  #Else we want this year + next year
        yearOne = datetime.now().year
        yearTwo = (datetime.now() + timedelta(weeks=52)).year

    season = str(yearOne) + str(yearTwo)
    seasonType = '2' #hard code for now, figure out later.

    statlines = getAllStatLines(season, seasonType)

    jStatlines = json.dumps(statlines)

    f = open('../statlines.json','w')
    f.write(jStatlines)
    f.close()


def getAllRosters(): #seasonType 1=pre season, 2=reg season, 3=playoffs
    results = {}
    teams = ['ANA','ARI','BOS','BUF','CAR','CBJ',
             'CGY','CHI','COL','DAL','DET','EDM',
             'FLA','LAK','MIN','MTL','NJD','NSH',
             'NYI','NYR','OTT','PHI','PIT','SJS',
             'STL','TBL','TOR','VAN','WPG','WSH']

    for team in teams:
        results[team] = getRosterForTeam(team)

    #Return all of the rosters
    return results

def getRosterForTeam(team):
    url = "http://nhlwc.cdnak.neulion.com/fs1/nhl/league/teamroster/%s/iphone/clubroster.json" % (team)
    print 'Fetching', url

    site = None
    try:
        site = urllib2.urlopen(url)
    except urllib2.HTTPError as e:
        print '404 -', url
        return None

    return json.load(site)


def getAllStatLines(season, seasonType): #seasonType 1=pre season, 2=reg season, 3=playoffs
    results = {}
    teams = ['ANA','ARI','BOS','BUF','CAR','CBJ',
             'CGY','CHI','COL','DAL','DET','EDM',
             'FLA','LAK','MIN','MTL','NJD','NSH',
             'NYI','NYR','OTT','PHI','PIT','SJS',
             'STL','TBL','TOR','VAN','WPG','WSH']

    for team in teams:
        results[team] = getStatLineForTeam(season, seasonType, team)

    #Return all of the rosters
    return results

def getStatLineForTeam(season, seasonType, team):
    url = "http://nhlwc.cdnak.neulion.com/fs1/nhl/league/playerstatsline/%s/%s/%s/iphone/playerstatsline.json" % (season, seasonType, team)
    print 'Fetching', url

    site = None
    try:
        site = urllib2.urlopen(url)
    except urllib2.HTTPError as e:
        print '404 -', url
        return None

    return json.load(site)

main()
    
