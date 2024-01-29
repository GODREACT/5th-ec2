import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config";
import axios from "axios";
import GoogleLoginButton from "../player/googleLoginbutton";

const GoogleLogin = () => {
  const [naverLoginButton, setNaverLoginButton] = useState();
  const navigate = useNavigate();

	const createMarkup = (html) => {
		return {__html: html};
	}
	const MyComponent = (html) => {
		return <div dangerouslySetInnerHTML={createMarkup(html)} />;
	}
	
	useEffect(()=> {
		axios.get(`${API_URL}/api/test/naverlogin`)
		.then(res => {
			console.log(res.data);
			setNaverLoginButton(MyComponent(res.data));
		}).catch(e => {
			console.error(e);
		})

		userAccessToken();
	}, []);

	const userAccessToken = () => {
    // window.location.href는 현재 페이지의 URL을 문자열로 반환하는 속성입니다.
    // includes 메소드를 사용하여 URL에 'code'이라는 문자열이 포함되어 있는지 확인합니다.
    // 만약 포함되어 있다면 getToken() 함수를 호출합니다.
    window.location.href.includes('code') && getToken();
	}
        
  const getToken = async () => {
    //?code=c4HdngWVGK3jEDwp2y&state=NAVER_STATE
    const code = window.location.href.split('=')[1].split('&')[0];
    const state = window.location.href.split('=')[2];
  
    // 이후 로컬 스토리지 또는 state에 저장하여 사용하자!   
    localStorage.setItem('code', code);
    localStorage.setItem('state', state);

			const callbackRes = await axios.get(`${API_URL}/api/test/callback?code=${code}&state=${state}`);
			console.log("callbackRes: ", callbackRes);

			const memberRes = await axios.get(`${API_URL}/api/test/member?access_token=${callbackRes.data.access_token}`);
			console.log("memberRes: ", memberRes);

			const naverlogin = await axios.post(`${API_URL}/api/user/naver-login`, 
				memberRes.data.response,
				{ withCredentials: true }// 쿠키 수정허용
			);
			
			console.log("naverlogin: ", naverlogin);

			if(naverlogin.status == 200){
				console.log('if 들어옴');
				alert("로그인성공!");
			}
	}

  return (
    <div>
      <div>
				<GoogleLoginButton />
      </div>
      <div>
        {naverLoginButton}
      </div>
    </div>
  )
}
export default GoogleLogin;