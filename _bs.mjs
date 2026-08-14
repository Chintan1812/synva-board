import sharp from "sharp"; import fs from "node:fs"; import path from "node:path";
const [srcDir,out]=process.argv.slice(2);
const files=fs.readdirSync(srcDir).filter(f=>/\.png$/i.test(f)).sort();
const CELL=430,COLS=4,PADT=36;
const rows=Math.ceil(files.length/COLS), W=COLS*CELL, H=rows*(CELL+PADT);
const comps=[];
for(let i=0;i<files.length;i++){
  const buf=await sharp(path.join(srcDir,files[i])).flatten({background:"#fff"})
    .trim({background:"#ffffff",threshold:24})
    .resize(CELL-20,CELL-20,{fit:"contain",background:"#fff"}).png().toBuffer();
  const c=i%COLS,r=Math.floor(i/COLS);
  comps.push({input:buf,left:c*CELL+10,top:r*(CELL+PADT)+PADT});
  comps.push({input:Buffer.from(`<svg width="${CELL}" height="${PADT}"><text x="10" y="26" font-family="monospace" font-size="24" fill="#c00">${files[i].replace(".png","")}</text></svg>`),left:c*CELL,top:r*(CELL+PADT)});
}
await sharp({create:{width:W,height:H,channels:3,background:"#eee"}}).composite(comps).png().toFile(out);
console.log(files.length,"->",out);
