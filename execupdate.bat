REM Simple script to execute some python scripts in a loop. Will be replaced when server executables becomes a higher priority.
:top
cd G:\HockeyDeck\python
python G:\HockeyDeck\python\parseplays.py
python G:\HockeyDeck\python\parsescores.py
sleep 15
goto top