function linspace(x1, x2, n){
  let fin = []
  for (let i=0; i<n; i++){
    fin.push(x1 + (x2 - x1)*(i/(n-1)))
  }

  return fin
}

function mult(m1, m2){
  let fin = []

  for(let i=0; i<m1.length; i++){
    fin.push([])
    for(let j=0; j<m2[0].length; j++){
      fin[i].push(0)
      for(let k=0; k<m2.length; k++){
        fin[i][j] += m1[i][k] * m2[k][j]
      }
    }
  }

  return fin
}

function sum(m1){
  let fin = 0

  for(let i=0; i<m1.length; i++){
    if( !Array.isArray(m1[i]) ){
      fin += m1[i]
      continue
    }

    else{
      for(let j=0; j<m1[i].length; j++){
        fin += m1[i][j]
      }
    }
  }

  return fin
}

function getNanoVelocities(l1Now, l1Next, l2Now, l2Next){
  var mu=1;
  var d=10;
  var a=1;
  var eps=4*a;
  var w=1;

  var dl1
  var dl2

  var l1
  var l2

  var nt=20;
  var t=linspace(0,eps/w,nt);

  // var m=zeros(3,3);
  // var dl=zeros(3,1);
  // var v1=zeros(1,nt);
  // var x=zeros(3,1);

  var m=[
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ]
  var dl=[
    [0],
    [0],
    [0]
  ]
  var v1=[];
  for(let i=0; i<nt; i++){v1.push(0)}
  var x=[
    [0],
    [0],
    [0]
  ]

  // L1Now=1;
  // L1Next=0;
  // L2Now=1;
  // L2Next=0;

  // for i=1:nt
  //
  //     if l1Now == 0 && l1Next==0;
  //         l1 = d-eps;
  //         dl1 = 0;
  //     elseif l1Now == 0 && l1Next==1;
  //         l1 = d-eps+w*t(i);
  //         dl1=W;
  //     elseif l1Now == 1 && l1Next==0;
  //         l1 = d-w*t(i);
  //         dl1= -w;
  //     elseif l1Now == 1 && l1Next==1;
  //         l1 = d;
  //         dl1=0;
  //     end
  //
  //
  //     if l2Now == 0 && l2Next==0;
  //         l2 = d-eps;
  //         dl2 = 0;
  //     elseif l2Now == 0 && l2Next==1;
  //         l2 = d-eps+w*t(i);
  //         dl2=w;
  //     elseif l2Now == 1 && l2Next==0;
  //         l2 = d-w*t(i);
  //         dl2= -w;
  //     elseif l2Now == 1 && l2Next==1;
  //         l2 = d;
  //         dl2=0;
  //     end

  for(let i=0; i<nt; i++){

    if (l1Now == 0 && l1Next==0){
      l1 = d-eps;
      dl1 = 0;
    }

    else if (l1Now == 0 && l1Next==1){
      l1 = d-eps+w*t[i];
      dl1=w;
    }

    else if (l1Now == 1 && l1Next==0){
      l1 = d-w*t[i];
      dl1= -w;
    }

    else if (l1Now == 1 && l1Next==1){
      l1 = d;
      dl1=0;
    }



    if(l2Now == 0 && l2Next==0){
      l2 = d-eps;
      dl2 = 0;
    }

    else if (l2Now == 0 && l2Next==1){
      l2 = d-eps+w*t[i];
      dl2=w;
    }

    else if (l2Now == 1 && l2Next==0){
      l2 = d-w*t[i];
      dl2= -w;
    }

    else if (l2Now == 1 && l2Next==1){
      l2 = d;
      dl2=0;
    }


    //     L1 = D-eps-W*t(i);
    //     L2 = D-eps;
    //     dl1 = -W;
    //     dl2 = 0;

    let pi = Math.PI

    m[0][0]=1/6/pi/mu/a;
    m[0][1]=1/4/pi/mu/l1;
    m[0][2]=1/4/pi/mu/(l1+l2);
    m[1][0]=m[0][1];
    m[1][1]=m[0][0];
    m[1][2]=1/4/pi/mu/l2;
    m[2][0]=m[0][2];
    m[2][1]=m[1][2];
    m[2][2]=m[0][0];

    let im=math.inv(m);

    dl[0][0]=0;
    dl[1][0]=dl1;
    dl[2][0]=dl1+dl2;

    v1[i]= -sum(mult(im,dl))/sum(mult( im, [[1], [1], [1]] ));
  }


  v2=[]
  v3=[]

  for(let i=0; i<v1.length; i++){
    v2.push(v1[i] + dl1)
    v3.push(v1[i] + dl1 + dl2)
  }

  console.log("t: " + t)

  console.log("v1: " + v1)
  console.log("v2: " + v2)
  console.log("v3: " + v3)

  return [v1, v2, v3]


  // x[0][0]=trapz(t,v1);
  // x[1][0]=trapz(t,v2);
  // x[2][0]=trapz(t,v3);
}
