from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import time
import re
import socket
from collections import defaultdict

app = Flask(__name__)

CORS(app, origins=["*"]) 

#CORS(app, resources={r"/*": {"origins": ["http://localhost:5174", "http://localhost:5173"]}})

def normalize_mac(mac):
    return mac.lower().replace('-', ':').replace('.', '')

def get_arp_table():
    output = subprocess.check_output("arp -a", shell=True).decode()
    entries = re.findall(r'(\d+\.\d+\.\d+\.\d+)\s+([\w-]+)', output)
    return entries

def is_broadcast(mac, ip):
    return (
        mac.lower() == "ff-ff-ff-ff-ff-ff" or
        ip.endswith(".255") or
        ip == "255.255.255.255"
    )

def get_own_ips():
    return {i[4][0] for i in socket.getaddrinfo(socket.gethostname(), None)}

WHITELIST_IPS = get_own_ips()

def detect_arp_spoofing():
    mac_to_ips = defaultdict(set)
    entries = get_arp_table()
    for ip, mac in entries:
        mac = normalize_mac(mac)
        if not is_broadcast(mac, ip) and ip not in WHITELIST_IPS:
            mac_to_ips[mac].add(ip)

    suspicious = {mac: list(ips) for mac, ips in mac_to_ips.items() if len(ips) > 1}
    return suspicious

@app.route('/arp-data')
def get_arp_data():
    suspicious = detect_arp_spoofing()
    return jsonify(suspicious)

if __name__ == '__main__':
    app.run(port=5000, debug=True)