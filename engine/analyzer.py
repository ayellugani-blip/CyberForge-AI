import sys,math,json

# Read from stdin for better security
pw = sys.stdin.read().strip()
if not pw:
    sys.exit(1)

length=len(pw)

pool=0
if any(c.islower() for c in pw): pool+=26
if any(c.isupper() for c in pw): pool+=26
if any(c.isdigit() for c in pw): pool+=10
if any(not c.isalnum() for c in pw): pool+=32

entropy=length*math.log2(pool if pool else 1)

# simulated AMD GPU cracking speed
# modern GPUs ~ 150 billion guesses/sec (hashcat level)
gpu_speed=150_000_000_000

guesses=pool**length if pool else 1
seconds=guesses/gpu_speed

def human(sec):
    if sec<60: return "seconds"
    if sec<3600: return f"{int(sec/60)} minutes"
    if sec<86400: return f"{int(sec/3600)} hours"
    if sec<31536000: return f"{int(sec/86400)} days"
    return f"{int(sec/31536000)} years"

risk="LOW"
if entropy<40: risk="CRITICAL"
elif entropy<60: risk="HIGH"
elif entropy<80: risk="MEDIUM"

print(json.dumps({
    "entropy":round(entropy,2),
    "crack_time":human(seconds),
    "risk":risk
}))