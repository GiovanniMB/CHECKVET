async function getCitas() 
{    
    const res = await fetch('http://localhost:3000/');
    const resJson = await res.json();
    return resJson;
}
