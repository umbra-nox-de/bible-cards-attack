// Central random-number interface for battle logic.
// The default source is Math.random, while tests can inject a deterministic source.

const defaultRandom=()=>Math.random();

export function createRng(random=defaultRandom){
  const next=()=>{
    const value=Number(random());
    return Number.isFinite(value)?Math.max(0,Math.min(0.9999999999999999,value)):0;
  };

  return {
    next,
    chance(probability){return next()<Math.max(0,Math.min(1,Number(probability)||0));},
    int(maxExclusive){
      const max=Math.max(0,Math.floor(Number(maxExclusive)||0));
      return max?Math.floor(next()*max):0;
    },
    shuffle(items){
      const result=[...items];
      for(let i=result.length-1;i>0;i--){
        const j=Math.floor(next()*(i+1));
        [result[i],result[j]]=[result[j],result[i]];
      }
      return result;
    }
  };
}

export const battleRng=createRng();
