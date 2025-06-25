import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faAngleLeft,
  faBagShopping, faHouse, faUser, faCartShopping
} from '@fortawesome/free-solid-svg-icons';

function Footer(props) {
  const [isOpen, setIsOpen] = useState(false);
  /*const [footerHeight, setFooterHeight] = useState('200px'); // 높이 상태 추가*/

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
    /* setFooterHeight(prev => (prev === '200px' ? '450px' : '200px')); // 열고 닫을 때 높이 토글 => 반응형일 때, 토클 열릴경우 높이값 450으로 고정되는 문제 발생 */
  };

  return (
    // <footer style={{ height: footerHeight, transition: 'height 0.3s ease' }}>
    <footer className={`footer ${isOpen ? 'open' : ''}`}>
      <div className='footer_wrap'>
        <div className='footer_gnb'>
          <ul>
            <li><Link to="/">회사소개</Link></li>
            <li><Link to="/">이용약관</Link></li>
            <li><Link to="/">운영정책</Link></li>
            <li><Link to="/">개인정보처리방침</Link></li>
            <li><Link to="/">청소년보호정책</Link></li>
            <li><Link to="/">광고제휴</Link></li>
          </ul>
        </div>

        <hr className='footer_line' />

        {/* 모바일 아코디언 버튼 */}
        <div className='footer_con_mobile'>
          <button
            className='footer_toggle_btn'
            onClick={toggleOpen}
            aria-expanded={isOpen}
            aria-controls='footer_info_content'
          >
            회사정보 및 고객센터 운영시간
            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
          </button>
        </div>

        {/* 공통 회사 정보 (PC: 항상 노출 / 모바일: isOpen일 때만 노출) */}
        <div
          id='footer_info_content'
          className={`footer_con ${isOpen ? 'open' : 'closed'}`}
        >
          <div className='footer_address'>
            <p>그린마켓(주) &#124; C조 그린마켓</p>
            <p>사업자등록번호 : 113-86-45834</p>
            <p>호스팅서비스 제공자 : Amazon Web Services (AWS)</p>
            <p>EMAIL : help&#64;greenmarket.co.kr</p>
            <p>주소 : 서울특별시 서초구 서초대로 38길 12, 7, 10층(서초동, 마제스타시티, 힐스테이트 서리풀)</p>
          </div>

          <div className='footer_cs_tel'>
            <p>고객센터</p>
            <p>1670-2910</p>
          </div>

          <div className='footer_cs'>
            <p>CS운영시간</p>
            <p className='footer_cs_time'>
              9:00 - 18:00시 <br />
              (주말/공휴일 휴무, 점심시간 12:00 - 13:00)
            </p>
            <ul className='footer_cs_menu'>
              <li><Link to="/">공지사항</Link></li>
              <li><Link to="/">1:1문의하기</Link></li>
              <li><Link to="/">자주 묻는 질문</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 고정 하단 메뉴 */}
      <div className="fixed_mobile_footer">
        <button className="footer_btn" onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <Link to="/goodsinsert" className="footer_btn">
          <FontAwesomeIcon icon={faBagShopping} />
        </Link>
        <Link to="/" className="footer_btn">
          <FontAwesomeIcon icon={faHouse} />
        </Link>
        <Link to="/login" className="footer_btn">
          <FontAwesomeIcon icon={faUser} />
        </Link>
        <Link to="/cart" className="footer_btn">
          <FontAwesomeIcon icon={faCartShopping} />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
