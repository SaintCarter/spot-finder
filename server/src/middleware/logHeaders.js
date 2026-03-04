export default function logHeaderInfo(req, res, next) {
  console.log("Received request:");
  console.log("IP:", req.ip);
  //console.log("body:", req.body);
  //console.log("Header:", req.headers); 
  //console.log("Host:", req.get('Host'));
  //console.log("originalUrl:", req.originalUrl);
  //console.log("Method:", req.method);                     
  //console.log("User Agent:", req.get('User-Agent'));
  //console.log("Content Length:", req.get('Content-Length'));
  //console.log("Timestamp:", new Date().toISOString());
  next();
}