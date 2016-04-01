import urllib2
import pickle
import os.path
import json
import misc
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from HDOrderedDict import HDOrderedDict
import pprint
import time

class ParseStandings:
    def __init__(self):
        self.frequency = 3600 #Value in seconds, how often this should be run.
        self.next = int(time.time() - 1) #Next is anything after... now
        self.name = "Standings"

    def setNext(self):
        self.next = int(time.time() + self.frequency)

    def parse(self):
        standings = self.getStandings()
        
        jStandings = json.dumps(standings)

        f = open('G:/HockeyDeck/standings.json','w')
        f.write(jStandings)
        f.close()

    def getStandings(self):
        url = "http://app.cgy.nhl.yinzcam.com/V2/Stats/Standings"
        #print 'Fetching', url

        site = None
        try:
            site = urllib2.urlopen(url)
        except urllib2.HTTPError as e:
            #print '404 -', url
            return None
        
        bs = BeautifulSoup(site.read(), 'lxml-xml')

        response = []
        
        #First thing's first, get the stat headings that we want.
        headings = [{}, {}]
        
        league = bs.findAll('League')[0]
        headers = league.find_all('StatsGroup', recursive=False)

        for i in range(2): #Only two headers
            for attr in headers[i].attrs.keys():
                if 'Stat' in attr:
                    headings[i][attr] = headers[i].attrs[attr]

        
        for confNode in bs.findAll('Conference'):
            confName = confNode['Name'].title()
            for divisionNode in confNode.find_all('StatsSection'):
                divName = divisionNode['Heading'].title()
                for teamNode in divisionNode.find_all('Standing'):
                    teamInfo = {}
                    #Get the simple team info
                    teamInfo['Conference'] = confName
                    teamInfo['Division'] = divName
                    teamInfo['Name'] = teamNode['Team']
                    teamInfo['Abbreviation'] = teamNode['TriCode']
                    for attr in ['DivRank','ConfRank','LeagueRank']:
                        teamInfo[attr] = teamNode[attr]

                    #Get the specific stat lines.
                    lines = teamNode.find_all('StatsGroup', recursive=False)
                    for i in range(2):
                        for statAttr in headings[i].keys():
                            statName = headings[i][statAttr]
                            statValue = lines[i][statAttr]
                            teamInfo[statName] = statValue

                    #Last thing - fix the type of points
                    teamInfo['PTS'] = int(teamInfo['PTS'])
                    
                    response.append(teamInfo)

        return response

if __name__ == '__main__':
    p = ParseStandings()
    p.parse()

    
