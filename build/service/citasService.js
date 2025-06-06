async function getCitas() 
{    
    const res = await fetch('/citasHoy');
    const resJson = await res.json();
    return resJson;
}
 