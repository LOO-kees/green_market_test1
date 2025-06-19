import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import '../style/LogForm.css';

function MemberUpdate() {
  const { id } = useParams(); // 파라미터값 받음
  const [form, setForm] = useState({
    username: '',
    userid: '',
    password: '',
    phone: '',
    email: '',
    region: ''
  });
  const navigate = useNavigate();

  // 발송 데이터 통신 성공여부 확인 출력
  useEffect(() => {
    axios
    .get(`http://localhost:9070/member/${id}`) // 전체 조회된 내용 중 숫자를 get방식으로 하여 해당 내용 조회.
    .then(res => {
      console.log('서버 응답값 : ', res.data);
      setForm(res.data);
    })
    .catch(err => console.log('조회 오류 : ', err));
  }, [id]);

  // 양식에 입력한 내용 저장
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  // 수정 메뉴 클릭시 실행
  const handleSubmit = (e) => {
    e.preventDefault();

    const updateData = {
      username: form.username,
      phone: form.phone,
      email: form.email,
      region: form.region
    }

    // 비밀번호 변경하는 경우 입력하면 추가
    if (form.password) {
      updateData.password = form.password;
    }

    axios
    .put(`http://localhost:9070/member/update/${id}`, updateData)
    .then(() => {
      alert('수정이 완료되었습니다.');
      navigate('/');
    })
    .catch(err => console.log('수정 오류 : ', err));
  }

  return (
    <section>
      <form className='logform' onSubmit={handleSubmit}>
        <fieldset>
          <legend>회원정보 수정</legend>
          <p>
            <label htmlFor='logform_username'>성함</label>
            <input type='text' id='logform_username' name='username' required maxLength='10' value={form.username} onChange={handleChange} placeholder='성함 또는 별칭' />
          </p>
          <p>
            <label htmlFor='logform_userid'>아이디<span>(수정불가)</span></label>
            <input type='text' id='logform_userid' name='userid' required maxLength='30' value={form.userid} onChange={handleChange} readOnly placeholder='아이디' />
          </p>
          <p>
            <label htmlFor='logform_password'>비밀번호</label>
            <input type='password' id='logform_password' name='password' required maxLength='40' value={form.password} onChange={handleChange} placeholder='회원가입시 입력한 비밀번호 또는 변경할 비밀번호' />
          </p>
          <p>
            <label htmlFor='logform_phone'>휴대전화</label>
            <input type='tel' id='logform_phone' name='phone' required maxLength='11' value={form.phone} onChange={handleChange} placeholder='휴대전화(숫자만 입력' />
          </p>
          <p>
            <label htmlFor='logform_email'>이메일</label>
            <input type='email' id='logform_email' name='email' required maxLength='40' value={form.email} onChange={handleChange} placeholder='이메일(예. id@domain.com)' />
          </p>
          <p>
            <label htmlFor='logform_region'>지역</label>
            <select id='logform_region' name='region' required value={form.region} onChange={handleChange}>
              <option>선택하세요</option>
              <option value='강원도'>강원도</option>
              <option value='경기도'>경기도</option>
              <option value='경상도'>경상도</option>
              <option value='서울특별시'>서울특별시</option>
              <option value='전라도'>전라도</option>
              <option value='충청도'>충청도</option>
            </select>
          </p>

          <p className='logform_update'>
            <input type='submit' value='수정하기' />
          </p>
          <p className='logform_cancel'>
            <button type='button' value='취소' onClick={() => navigate('/')}>취소</button>
          </p>
        </fieldset>
      </form>
    </section>
  );
}

export default MemberUpdate;