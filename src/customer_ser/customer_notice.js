import React, { useState } from "react";
import './customer_notice.css'
import axios from "axios";
import { NavLink, useParams } from 'react-router-dom';
import { API_URL } from "../config/config";
import useAsync from '../customHook/useAsync';

function Customer_notice(){

  const [searchText, setSearchText] = useState("");
  const { id } = useParams();
  const [state] = useAsync(() => getNotice(id, searchText), [id, searchText]);
  const { loading, data: pdata, error } = state;

  async function getNotice(id, searchText) {
    const res = await axios.get(`${API_URL}/notice_detail`);
    const filteredData = res.data.filter(item => item.title.includes(searchText));
    return filteredData;
  }

  const handleLinkClick = async (id) => {
    try {
      console.log("조회수 증가+1");
      console.log("id값 :", id);
      await axios.post(`${API_URL}/notice_detail/${id}`);
    } catch (error) {
      console.error('Error increasing views:', error);
    }
  };

  const handleSearch = () => {
    const searchTerm = document.getElementById("input_search").value;
    setSearchText(searchTerm);
  };

  if (loading) return <div>로딩중입니다.....</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!pdata) return null;

  return(
    <div id="notice_body">
      <div id="notice_container">
        <div id="notice_inner_container">
          <div id="noticetext_search">
            <div id="notice_text"><p>공지사항</p></div>
            <div id="notice_search">
              <div >
                <input id="input_search" type="text" placeholder="검색어를 입력해주세요." />
              </div>
              <div id="notice_searchdiv" onClick={handleSearch}>
                <p>검색</p>
              </div>
            </div>
          </div>
  
          <div id="notice_data_list">
            <div id="datalist_title"><p>제목</p></div>
            <div id="datalist_regviw">
              <div id="datalist_regdt"><p>등록일</p></div>
              <div id="datalist_views"><p>조회수</p></div>
            </div>
          </div>
          {pdata.map((item) => (
            <NavLink
              id="aaa"
              to={`/customer/customer_detail/${item.id}`}
              onClick={() => handleLinkClick(item.id)}
              key={item.id}
              style={{ textDecoration: 'none' }}
            >
              <div id="notice_data_list1">
                <div id="datalist_title">
                  
                    <p id="datalist_title">
                      {item.title}
                    </p>
                  
                </div>
                <div id="datalist_regviw">
                  <div id="datalist_regdt">{item.regdt}</div>
                  <div id="datalist_views">{item.views}</div>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Customer_notice;