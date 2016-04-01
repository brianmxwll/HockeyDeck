import urllib2
import json
import time
from datetime import datetime, timedelta

class ParseScores:
    def __init__(self):
        self.frequency = 10 #Value in seconds, how often this should be run.
        self.next = int(time.time() - 1) #Next is anything after... now
        self.name = "Scores"

    def setNext(self):
        self.next = int(time.time() + self.frequency)

    def parse(self):
        today = (datetime.now() - timedelta(hours=11)).strftime('%Y-%m-%d')
        response = urllib2.urlopen('https://statsapi.web.nhl.com/api/v1/schedule?startDate=%s&endDate=%s&expand=schedule.teams,schedule.linescore,schedule.broadcasts,schedule.decisions,schedule.scoringplays,schedule.game.content.highlights.scoreboard&site=en_nhl' % (today,today))#(today, today))
        response = response.read()
        jObj = json.loads(response)

        jObj = self.remove_specific_key(jObj, 'link')
        jObj = self.remove_specific_key(jObj, 'copyright')

        
        res = json.dumps(jObj)

        f = open('G:/HockeyDeck/scores.json','w')
        f.write(res)
        f.close()

    def remove_specific_key(self, the_dict, rubbish):
        if rubbish in the_dict:
            del the_dict[rubbish]
        for key, value in the_dict.items():
            # check for rubbish in sub dict
            if isinstance(value, dict):
                self.remove_specific_key(value, rubbish)

            # check for existence of rubbish in lists
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, dict):
                        self.remove_specific_key(item, rubbish)
        return the_dict

if __name__ == '__main__':
    p = ParseScores()
    p.parse()