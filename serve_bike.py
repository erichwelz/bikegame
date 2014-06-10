import subprocess
import time
import sys
import SimpleHTTPServer
import SocketServer
import StringIO
import json
import threading
import serial

global revolutions
global frequency
global distance
global velocity

def setup_tty():
    '''Returns a file object you can use with get_revolutions.'''

    # Hard coded to work on Paul's laptop
    tty = serial.Serial('/dev/ttyACM0')
    
    sys.stderr.write("Booting ...\n")
    tty.readline() # Wait for the line that's sent after Arduino resets

    sys.stderr.write("Bike ready ...\n")

    return tty 
        
def get_revolutions(tty):
    '''tty is a file object like what start returns'''
    while True:
        tty.write(' ')
        line = tty.readline()
        if line == '':
            time.sleep(0.1)
            continue
        return int(line)/2.0

def average(samples):
    '''Return the average of the given samples.'''
    return sum(samples) / len(samples)
    
def derivative(samples):
    '''Calculates the per-second change in a value, averaged over the given sample set.'''
    if None in samples:
        # Don't calculate if we don't have enough samples
        return None

    dsamples = []
    for i in range(0, len(samples)-1):
        (v1, t1) = samples[i]
        (v2, t2) = samples[i+1]

        v1 = float(v1)
        v2 = float(v2)

        dv = v1 - v2
        dt = t1 - t2

        dsamples = dsamples + [(dv / dt)]

    return average(dsamples)

def sampling_thread():
    tty = setup_tty()
    sample_count = 30
    revolutions_samples = [None]*sample_count
    distance_samples = [None]*sample_count

    global revolutions
    global frequency
    global distance
    global velocity

    while True:
        timestamp = time.time()
    
        revolutions = get_revolutions(tty)
        revolutions_samples = revolutions_samples[1:] + [(revolutions, timestamp)]
        frequency = derivative(revolutions_samples)
        
        distance = revolutions * 2.1545 # 2.1545m is circumference of 27" wheel
        if frequency != None:
            velocity = frequency * 2.1545
        else:
            velocity = None

        if None not in revolutions_samples and None not in distance_samples:
            pass
            #print("%.2f\t%.2fhz\t%.2fm\t%.2fm/s" % (revolutions, frequency, distance, velocity))

        time.sleep(1.0/15.0)

class BikeRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        global revolutions
        global frequency
        global distance
        global velocity

        data = {
            "revolutions": revolutions,
            "frequency": frequency,
            "distance": distance,
            "velocity": velocity,
        }
        
        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.send_header('Access-Control-Allow-Origin', '*'),
        self.send_header('Access-Control-Allow-Credentials', 'true'),
        self.send_header('Access-Control-Allow-Headers', 'Authorization')

        self.end_headers()
        json.dump(data, self.wfile)

httpd = SocketServer.TCPServer(("", 8082), BikeRequestHandler)

threading.Thread(target=sampling_thread).start()
sys.stderr.write("Sampling ...\n")

sys.stderr.write("Serving ...\n")
httpd.serve_forever()
