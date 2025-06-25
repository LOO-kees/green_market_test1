// src/components/Header.js
import React, { useState, useEffect } from 'react';
import '../style/common.css'
import { Link, useNavigate } from 'react-router-dom';   
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faUser,
  faUserPlus,
  faHeadset,
  faShoppingCart,
  faSignOut,
  faBars,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null); // (회원정보 수정을 위함)
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    const storedId = localStorage.getItem('id');
    setUsername(storedName);
    setId(storedId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    setUsername(null);
    setId(null);
    navigate('/');
  };

  return (
    <header>
      <div className='header_wrap'>
        <div className='header_logo'>
          <Link to="/">
            <img
              src={`${process.env.PUBLIC_URL}/images/header_logo.png`}
              alt="메뉴보기"
            />
          </Link>
        </div>

        <div className='mobile_menu_wrap'>
          {/* 모바일 검색 */}
          <form onSubmit={e => {
            e.preventDefault();
            const kw = e.target.keyword.value.trim();
            if (kw) navigate(`/productpage?keyword=${encodeURIComponent(kw)}`);
          }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="header_search-icon_mb" />
            <input name="keyword" type="text" placeholder="검색어" />
          </form>
          <button
            className="mobile_menu_btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="mobile_menu_icon" />
          </button>
        </div>

        <div className='header_search_wrap'>
          {/* PC 검색 */}
          <form onSubmit={e => {
            e.preventDefault();
            const kw = e.target.keyword.value.trim();
            if (kw) navigate(`/productpage?keyword=${encodeURIComponent(kw)}`);
          }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="header_search-icon" />
            <input
              name="keyword"
              type='text'
              placeholder="상품명을 입력하고 Enter"
            />
          </form>
        </div>

        {/* 모바일 메뉴 & 오버레이 */}
        {menuOpen && windowWidth < 768 && (
          <>
            <div className="mobile_overlay" onClick={() => setMenuOpen(false)} />
            <div
              className="mobile_menu"
              style={{ transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}
            >
              <ul>
                {username ? (
                  <>
                    <li><span className='header_username'>{username}님!</span></li>
                    <li><button onClick={handleLogout}>로그아웃</button></li>
                    <li><Link to="/cart" onClick={() => setMenuOpen(false)}>장바구니</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" onClick={() => setMenuOpen(false)}>로그인</Link></li>
                    <li><Link to="/register" onClick={() => setMenuOpen(false)}>회원가입</Link></li>
                  </>
                )}
                <li><Link to="/notice" onClick={() => setMenuOpen(false)}>고객센터</Link></li>
              </ul>
              <ul>
                <li><Link to="/notice" onClick={() => setMenuOpen(false)}>공지사항</Link></li>
                <li><Link to="/inquiry" onClick={() => setMenuOpen(false)}>1:1 문의하기</Link></li>
                <li><Link to="/qna" onClick={() => setMenuOpen(false)}>자주 묻는 질문</Link></li>
              </ul>
              <ul>
                <li><Link to="/productpage" onClick={() => setMenuOpen(false)}>중고마켓</Link></li>
                <li><Link to="/goodsinsert" onClick={() => setMenuOpen(false)}>판매등록</Link></li>
                <li><Link to="/" onClick={() => setMenuOpen(false)}>그린커뮤니티</Link></li>
              </ul>
            </div>
          </>
        )}

        {/* PC 메뉴 */}
        <nav className='header_lnb_wrap'>
          <ul>
            {username ? (
              <>
                <li className='header_username_wrap'>
                  <span className='header_username'>{username}님!</span>
                </li>
                <li>
                  <button onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOut} className="header_logout-icon" />
                    <span className="header_logout-text">로그아웃</span>
                  </button>
                </li>
                <li>
                  <Link to={`/member/update/${id}`}>
                    <FontAwesomeIcon icon={faUser} className="header_userup-icon" />
                    <span className="header_userup-text">회원수정</span>
                  </Link>
                </li>
                <li>
                  <Link to="/cart">
                    <FontAwesomeIcon icon={faShoppingCart} className="header_cart-icon" />
                    <span className="header_cart-text">장바구니</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">
                    <FontAwesomeIcon icon={faUser} className="header_login-icon" />
                    <span className="header_login-text">로그인</span>
                  </Link>
                </li>
                <li>
                  <Link to="/register">
                    <FontAwesomeIcon icon={faUserPlus} className="header_register-icon" />
                    <span className="header_register-text">회원가입</span>
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/notice">
                <FontAwesomeIcon icon={faHeadset} className="header_cs-icon" />
                <span className="header_cs-text">고객센터</span>
              </Link>
            </li>
          </ul>
        </nav>

        <nav className='header_gnb_wrap'>
          <ul>
            <li><Link to="/productpage">중고마켓</Link></li>
            <li><Link to="/goodsinsert">판매등록</Link></li>
            <li><Link to="/">그린커뮤니티</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
