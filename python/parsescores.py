import urllib2
import json
from datetime import datetime, timedelta
def main():
    today = (datetime.now() - timedelta(hours=11)).strftime('%Y-%m-%d')
    response = urllib2.urlopen('https://statsapi.web.nhl.com/api/v1/schedule?startDate=%s&endDate=%s&expand=schedule.teams,schedule.linescore,schedule.broadcasts,schedule.decisions,schedule.scoringplays,schedule.game.content.highlights.scoreboard&site=en_nhl' % ('2016-03-18','2016-03-18'))#(today, today))
    response = response.read()
    jObj = json.loads(response)

    jObj = remove_specific_key(jObj, 'link')
    jObj = remove_specific_key(jObj, 'copyright')

    
    res = json.dumps(jObj)

    f = open('../scores.json','w')
    f.write(res)
    f.close()

def remove_specific_key(the_dict, rubbish):
    if rubbish in the_dict:
        del the_dict[rubbish]
    for key, value in the_dict.items():
        # check for rubbish in sub dict
        if isinstance(value, dict):
            remove_specific_key(value, rubbish)

        # check for existence of rubbish in lists
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    remove_specific_key(item, rubbish)
    return the_dict

main()
