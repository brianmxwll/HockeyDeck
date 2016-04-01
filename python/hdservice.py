### Usage : python aservice.py install (or / then start, stop, remove)
### Props: http://goo.gl/H6aq0q (ryrobes.com)

import win32service
import win32serviceutil
import win32api
import win32con
import win32event
import win32evtlogutil
import os
import sys
import string
import time
import parseplays
import parserosters
import parsescores
import parsestandings

class aservice(win32serviceutil.ServiceFramework):

    _svc_name_ = 'HockeyDeckSrv'
    _svc_display_name_ = 'HockeyDeck Data Service'
    _svc_description_ = 'This service provides the continuous loop to pull relevant hockey data from the web for client consumption.'

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.hWaitStop)

    def SvcDoRun(self):
        import servicemanager
        servicemanager.LogMsg(servicemanager.EVENTLOG_INFORMATION_TYPE,
                              servicemanager.PYS_SERVICE_STARTED,
                              (self._svc_name_, ''))

        self.timeout = 1000  # 1 second - how long the service will wait to run / refresh itself

        
         # Instantiate all of our parsers
        modules = []
        modules.append(parseplays.ParsePlays())
        modules.append(parserosters.ParseRosters())
        modules.append(parsescores.ParseScores())
        modules.append(parsestandings.ParseStandings())

        while 1:

            #No try/catch, we want to find problems for now. Let it crash!

            # Wait for service stop signal, if I timeout, loop again
            rc = win32event.WaitForSingleObject(self.hWaitStop, self.timeout)

            # Check to see if self.hWaitStop happened
            if rc == win32event.WAIT_OBJECT_0:
                # Stop signal encountered
                servicemanager.LogInfoMsg('HockeyDeckSrv - STOPPED!')  # Log it in the Event Log
                break
            else:
                for m in modules: #Iterate over each module, they all have the same method signature.
                    if m.next < time.time(): #If we should be running now, let's do it.
                        servicemanager.LogInfoMsg('HockeyDeckSrv - Parsing ' + m.name)  # Log the specific parsing, for later record.

                        m.parse()   # Do the work
                        m.setNext() # Track when we should parse again
 

def ctrlHandler(ctrlType):
    return True


if __name__ == '__main__':
    win32api.SetConsoleCtrlHandler(ctrlHandler, True)
    win32serviceutil.HandleCommandLine(aservice)
