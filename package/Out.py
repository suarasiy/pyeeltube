import os
import logging as lg
import package.Temporary as temp

class Log:

    history = []

    id = ""
    date = ""
    time = ""

    def __init__(self, id, date, time):
        self.id = id
        self.date = date
        self.time = time

    def __call__(self):
        print(
            "\n" +
            "== LOG ==\n" +
            self.history
            )
    
    def __str__(self):
        print(self.history)

    def add_log(self, message):
        self.history.append(message)