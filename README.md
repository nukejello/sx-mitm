# sx.xecuter.com MITM
## Why
Team Xecuter didn't check the SSL cert on the webserver and make sure its valid and I doubt they'll use certificate pinning if they fix this.  
Discovered when using a proxy set in the system settings and not seeing any traffic from SX OS being made in Fiddler, so conclusion was made that their request library did not honor system settings.  
Tried using a self-signed certificate and it made requests and honored what was sent back from the server.
## Usage
* Run `npm install`
* In `zones.json` change `192.168.7.211` to whatever your local IP address is
* set your router's DNS settings to your local IP
* restart your switch into SX OS
* Run `npm start`
## Credits
Some code is sourced from [Pēteris Ņikiforovs's dns proxy article](https://peteris.rocks/blog/dns-proxy-server-in-node-js-with-ui/) because I hate DNS (licensed under Apache License 2.0)