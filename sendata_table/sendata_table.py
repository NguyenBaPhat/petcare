import time
import datetime
import paho.mqtt.client as mqtt
import ssl
import json
import _thread
import random


def on_connect(client, userdata, flags, rc):
    print("Connected to AWS IoT: " + str(rc))

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
client.on_connect = on_connect
client.tls_set(ca_certs='sendata_table\RootCA.pem', certfile='sendata_table\certificate.pem.crt', keyfile='sendata_table\private.pem.key', tls_version=ssl.PROTOCOL_SSLv23)
client.tls_insecure_set(True)
client.connect("a3rzyndk1wefwy-ats.iot.ap-southeast-2.amazonaws.com", 8883, 60)

def publishData(txt):

    while (True):
    
        ABack_x = random.randint(0, 1000)
        ABack_y = random.randint(0, 1000)
        ABack_z = random.randint(0, 1000)
        GBack_x = random.randint(0, 1000)
        GBack_y = random.randint(0, 1000)
        GBack_z = random.randint(0, 1000)
        ANeck_x = random.randint(0, 1000)
        ANeck_y = random.randint(0, 1000)
        ANeck_z = random.randint(0, 1000)
        GNeck_x = random.randint(0, 1000)
        GNeck_y = random.randint(0, 1000)
        GNeck_z = random.randint(0, 1000)
        temp = random.randint(35, 40)
        batterry = random.randint(0, 100)
        lat= 10
        long= 106
        health = "Normal"
        behavior = "Good"

        now = datetime.datetime.utcnow() + datetime.timedelta(hours=7)
        timestamp = now.strftime("%Y-%m-%d %H:%M:%S") 
        
        #client.publish("raspi/data", payload=json.dumps({"distance": distance}), qos=0, retain=False)
        client.publish("raspi/data", payload=json.dumps({"timestamp": timestamp, "health": health, "ABack_x": ABack_x, "ABack_y": ABack_y, "ABack_z": ABack_z, "GBack_x": GBack_x,
                                                         "GBack_y": GBack_y,"GBack_z": GBack_z,"ANeck_x": ANeck_x, "ANeck_y": ANeck_y, "ANeck_z": ANeck_z, "GNeck_x": GNeck_x,
                                                         "GNeck_y": GNeck_y,"GNeck_z": GNeck_z,"temp": temp,"batterry": batterry,"lat": lat, "long": long, "behavior": behavior}), qos=0, retain=False)
        
        print(timestamp)
        time.sleep(0.5)
 
_thread.start_new_thread(publishData,("Spin-up new Thread...",))

client.loop_forever()