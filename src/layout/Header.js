import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/common.css';
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
  const [id, setId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const name = localStorage.getItem('username');
    const uid  = localStorage.getItem('id');
    setUsername(name);
    setId(uid);
  }, []);

  useEffect(() => {
    const onResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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

        {/* 로고 */}
        <div className='header_logo'>
          <Link to="/"><img src={`${process.env.PUBLIC_URL}/images/header_logo.png`} alt="Green Market" /></Link>
        </div>

        {/* 모바일 검색 + 햄버거 */}
        <div className='mobile_menu_wrap'>
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

        {/* PC 검색 */}
        <div className='header_search_wrap'>
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

        {/* 모바일 메뉴 오버레이 */}
        {menuOpen && windowWidth < 768 && (
          <>
            <div className="mobile_overlay" onClick={() => setMenuOpen(false)} />
            <div className="mobile_menu" style={{ transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
              <ul>
                {username ? (
                  <>
                    <li><span className='header_username'>{username}님!</span></li>
                    <li><button onClick={handleLogout}>로그아웃</button></li>
                    <li><Link to={`/member/update/${id}`} onClick={() => setMenuOpen(false)}>회원수정</Link></li>
                    <li><Link to="/cart" onClick={() => setMenuOpen(false)}>장바구니</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" onClick={() => setMenuOpen(false)}>로그인</Link></li>
                    <li><Link to="/register" onClick={() => setMenuOpen(false)}>회원가입</Link></li>
                  </>
                )}
                <li><Link to="/notice" onClick={() => setMenuOpen(false)}>공지사항</Link></li>
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
                <li className='header_username_wrap'><span className='header_username'>{username}님!</span></li>
                <li><button onClick={handleLogout}><FontAwesomeIcon icon={faSignOut} />로그아웃</button></li>
                <li><Link to={`/member/update/${id}`}><FontAwesomeIcon icon={faUser} />회원수정</Link></li>
                <li><Link to="/cart"><FontAwesomeIcon icon={faShoppingCart} />장바구니</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login"><FontAwesomeIcon icon={faUser} />로그인</Link></li>
                <li><Link to="/register"><FontAwesomeIcon icon={faUserPlus} />회원가입</Link></li>
              </>
            )}
            <li><Link to="/notice"><FontAwesomeIcon icon={faHeadset} />고객센터</Link></li>
          </ul>
        </nav>

        {/* 글로벌 네비게이션 */}
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
