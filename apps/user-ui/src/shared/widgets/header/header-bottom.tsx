'use client'

import { useEffect, useState } from 'react';

const HeaderBottom = () => {

    const [show, setShow] = useState(false);
    const [isSticky, setIsSticky] = useState(false);


    //Task scroll position 

    useEffect(() => {
      const handleScroll = () => {
        if(window.screenY > 100){
          setIsSticky(true);
        }
        else {
          setIsSticky(false);
        }
      }
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll)
    },[]);

    

  return (
    <div className=''>
      
    </div>
  )
}

export default HeaderBottom
