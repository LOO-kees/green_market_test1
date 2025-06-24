// src/components/NoticeDetail.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import SupportMnu from './SupportMnu';
import '../style/notice.css';
import '../style/support.css';
import '../style/noticeDetail.css';

function NoticeDetail() {
  const { id } = useParams();
  const [form, setForm] = useState({
    category: '',
    title: '',
    datetime: '',
    content: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/notice/${id}`
      )
      .then(res => setForm(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === 'admin');
    }
  }, []);

  const delData = () => {
    if (!window.confirm('데이터를 삭제하시겠습니까?')) return;
    axios
      .delete(
        `https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/notice/${id}`
      )
      .then(() => {
        alert('삭제가 완료되었습니다.');
        navigate('/notice');
      })
      .catch(err => console.error(err));
  };

  function formatDate(dt) {
    return dt ? new Date(dt).toISOString().split('T')[0] : '';
  }

  return (
    <section className='support_section notice_section'>
      <h2 className='support_none'>고객센터 - 공지사항</h2>
      <SupportMnu />
      <article className='support_page notice_page notice_detail'>
        <h3 className='support_none'>공지사항 세부 내용</h3>
        {isAdmin && (
          <div className='notice_hidden_top'>
            <button onClick={() => navigate(`/notice/update/${id}`)}>
              수정
            </button>
            <button onClick={delData}>삭제</button>
          </div>
        )}
        <div className='notice_top'>
          <p className='notice_title'>
            [{form.category}] {form.title}
          </p>
          <p className='notice_dateday'>{formatDate(form.datetime)}</p>
        </div>
        <div className='notice_mid'>
          <button onClick={() => navigate('/notice')}>목록</button>
        </div>
        <div className='notice_btm'>
          <p className='notice_cont'>{form.content}</p>
        </div>
      </article>
    </section>
  );
}

export default NoticeDetail;
