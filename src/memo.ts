function func(req : any, res : any) {
  console.log('ip >>', req.ip);
  console.log('method >>', req.method);
  console.log('path >>', req.path);
  console.log('protocol >>', req.protocol);
  console.log('query name >>', req.query.name);

  if(req.query.name){
    res.status(200).send('Hello! your name : ' + req.query.name);
  }
  else{
    res.status(400).send('Who are you?');
  }

  res.end();
}


function preProcess1(req:any, res:any, next:any) {
  console.log('1個目の前処理したよ！');
  next();
}
function preProcess2(req:any, res:any, next:any) {
  console.log('2個目の前処理したよ！');
  next();
}
function mainProcess(req:any, res:any) {
  //res.redirect()
  res.send('メインの処理をしたよ!');
}
