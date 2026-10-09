// Test-only HTTP adapter. D1 uses real SQLite; R2 is an in-memory fixture.
import http from 'node:http';
import worker from '../src/worker.js';
import {environment} from './harness.js';
const {env}=environment();
const server=http.createServer(async(req,res)=>{
 try {
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const body=Buffer.concat(chunks);
  const response=await worker.fetch(new Request('https://quiz.test'+req.url,{method:req.method,headers:req.headers,...(body.length?{body}: {})}),env);
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(e){res.writeHead(500);res.end(String(e));}
});
server.listen(18082,'127.0.0.1',()=>console.log('READY'));
