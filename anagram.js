const handleAnagram = (t1, t2) => {
  const text1 = t1.split("").sort().join("");
  const text2 = t2.split("").sort().join("");

  if(text1 === text2){
    console.log(t1, "and", t2, "is an Anagram")
  }
  else{
    console.log(t1, "and", t2, "is not an Anagram")
  }
}

handleAnagram('mono', 'moon')