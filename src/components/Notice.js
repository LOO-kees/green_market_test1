// src/components/Notice.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import SupportMnu from './SupportMnu';
import '../style/notice.css';
import '../style/support.css';

function Notice() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === 'admin');
    }
  }, []);

  const loadData = () => {
    axios
      .get(
        'https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/notice'
      )
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  useEffect(loadData, []);

  const delData = id => {
    if (!window.confirm('데이터를 삭제하시겠습니까?')) return;
    axios
      .delete(
        `https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/notice/${id}`
      )
      .then(() => {
        alert('삭제가 완료되었습니다.');
        loadData();
      })
      .catch(err => console.error(err));
  };

  function formatDate(datetime) {
    return new Date(datetime).toISOString().split('T')[0];
  }

  return (
    <section className='support_section notice_section'>
      <h2 className='support_none'>고객센터 - 공지사항</h2>
      <SupportMnu />
      <article className='support_page notice_page'>
        <h3 className='support_none'>공지사항</h3>
        <table>
          <caption>공지사항</caption>
          <thead>
            <tr>
              <th>No.</th>
              <th>제목</th>
              <th>작성자</th>
              <th>게시일</th>
              {isAdmin && <th>관리</th>}
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <Link to={`/notice/${item.id}`}>
                    [{item.category}] {item.title}
                  </Link>
                </td>
                <td>{item.writer}</td>
                <td>{formatDate(item.datetime)}</td>
                {isAdmin && (
                  <td>
                    <button
                      onClick={() => navigate(`/notice/update/${item.id}`)}
                    >
                      수정
                    </button>
                    <button onClick={() => delData(item.id)}>삭제</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {isAdmin && (
          <div className='notice_crt_btn'>
            <button onClick={() => navigate('/notice/create')}>등록</button>
          </div>
        )}
      </article>
    </section>
  );
}

export default Notice;
