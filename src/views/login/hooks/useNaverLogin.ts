import {useEffect, useState, useCallback} from 'react';

const useNaverLogin = ()=>{ 
    const [isLoading, setIsLoading] = useState(true);
  
    const handleLoadingToggle = (flag: boolean) => {
      setIsLoading(flag);
    };
  
    const handleNaverLogin = useCallback(
      async (token: string) => {
        try{
          const response = await axios.get('/v1/nid/me',{
            headers :{
              Authorization : `Bearer ${token}`
            }
           }
  
           // 위 response를 가지고 서비스에 알맞는 로직을 구성해주시면 됩니다
  
         }catch(error){
            console.error(error)
            setIsLoading(false)
         }
  
    }, [])
  
    useEffect(()=>{
      const token = router?.asPath?.split('=')[1]?.split('&')[0];
      // 네이버 아이디 로그인이 query에 accesstoken으로 넘겨주는 값을 추출해옵니다.
  
      if(token) handleNaverLogin(token)
  
    },[...dependencies])
  
    return {isLoading, onLoadingToggle : handleLoadingToggle}
  }
  
  export default useNaverLogin;