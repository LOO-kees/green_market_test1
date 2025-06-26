// components/GoodsInsert.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/GoodsInsert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const BASE_URL = 'https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app';

function GoodsInsert() {
  const navigate = useNavigate();

  // 로그인 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  }, [navigate]);

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '', kind: '', brand: '', price: '',
    trade_type: '', condition: '', region: '',
    description: '', shipping_fee: ''
  });
  const [images, setImages] = useState(Array(7).fill(''));
  const [imageFiles, setImageFiles] = useState({});
  const fileInputRefs = useRef([]);
  const [thumbStartIndex, setThumbStartIndex] = useState(0);

  // 썸네일 개수 & 반응형
  function getThumbnailsPerPage(w) {
    if (w >= 1024) return 6;
    if (w >= 768) return 6;
    return 3;
  }
  const [thumbnailsPerPage, setThumbnailsPerPage] = useState(getThumbnailsPerPage(window.innerWidth));
  useEffect(() => {
    const onResize = () => setThumbnailsPerPage(getThumbnailsPerPage(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const maxStartIndex = Math.max(images.length - 1 - thumbnailsPerPage, 0);
  useEffect(() => {
    setThumbStartIndex(prev => Math.min(prev, maxStartIndex));
  }, [thumbnailsPerPage, maxStartIndex]);

  // 입력 핸들러
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 파일 업로드
  const onThumbnailClick = idx => fileInputRefs.current[idx]?.click();
  const onFileChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    // 미리보기
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages(prev => {
        const c = [...prev]; c[idx] = reader.result; return c;
      });
    };
    reader.readAsDataURL(file);
    // 실제 파일
    setImageFiles(prev => ({ ...prev, [idx]: file }));
  };

  const handlePrev = () => setThumbStartIndex(i => Math.max(i - 1, 0));
  const handleNext = () => setThumbStartIndex(i => Math.min(i + 1, maxStartIndex));

  // 제출
  const handleSubmit = async e => {
    e.preventDefault();
    const {
      title, kind, brand, price,
      trade_type, condition, region,
      description, shipping_fee
    } = formData;

    // 유효성
    if (!title || !kind || !brand || !price || !trade_type ||
        !condition || !region || !description || !shipping_fee) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (isNaN(price) || isNaN(shipping_fee)) {
      alert('가격과 배송비는 숫자로 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // FormData 구성
    const fd = new FormData();
    fd.append('title', title);
    fd.append('brand', brand);
    fd.append('kind', kind);
    fd.append('price', price);
    fd.append('trade_type', trade_type);
    fd.append('condition', condition);
    fd.append('region', region);
    fd.append('description', description);
    fd.append('shipping_fee', shipping_fee);

    Object.entries(imageFiles).forEach(([idx, file]) => {
      const field = idx === '0' ? 'image_main' : `image_${idx}`;
      fd.append(field, file);
    });

    try {
      const res = await axios.post(
        `${BASE_URL}/greenmarket/products`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.data.success) {
        alert('등록이 완료되었습니다.');
        navigate('/productpage');
      }
    } catch (err) {
      console.error('등록 중 오류:', err.response?.data || err.message);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) navigate('/');
  };

  return (
    <div className="goods-insert-container">
      <h2>판매등록</h2>
      <form className="goods-insert-form" onSubmit={handleSubmit}>
        {/* 제목 */}
        <p>
          <label htmlFor="title">제목</label>
          <input
            id="title" name="title" type="text"
            placeholder="안 쓰는 물건 팔아요"
            required value={formData.title}
            onChange={handleChange}
          />
        </p>

        {/* 카테고리 */}
        <p>
          <label htmlFor="kind">카테고리</label>
          <select
            id="kind" name="kind" required
            value={formData.kind} onChange={handleChange}
          >
            <option value="">제품선택</option>
            <option value="여성의류">여성의류</option>
            <option value="남성의류">남성의류</option>
            <option value="가방">가방</option>
            <option value="신발">신발</option>
            <option value="패션잡화">패션잡화</option>
            <option value="키즈">키즈</option>
            <option value="라이프">라이프</option>
            <option value="전자기기">전자기기</option>
            <option value="기타">기타</option>
          </select>
        </p>

        {/* 브랜드 */}
        <p>
          <label htmlFor="brand">브랜드선택</label>
          <select
            id="brand" name="brand" required
            value={formData.brand} onChange={handleChange}
          >
            <option value="">선택</option>
            <option value="NoBrand">NoBrand</option>
            <option value="나이키">나이키</option>
            <option value="아디다스">아디다스</option>
            <option value="자라">자라</option>
            <option value="유니클로">유니클로</option>
            <option value="폴로 랄프 로렌">폴로 랄프 로렌</option>
            <option value="타미힐피거">타미힐피거</option>
            <option value="리바이스">리바이스</option>
            <option value="삼성">삼성</option>
            <option value="애플">애플</option>
            <option value="다이소">다이소</option>
          </select>
        </p>

        {/* 사진 업로드 */}
        <label>사진</label>
        <div className="photo-section">
          {/* 메인 */}
          <div className="main-photo" onClick={() => onThumbnailClick(0)}>
            {images[0]
              ? <img src={images[0]} alt="상품 이미지" />
              : <FontAwesomeIcon icon={faCamera} style={{ fontSize: 48, color: '#555' }} />
            }
            <input
              type="file" accept="image/*" style={{ display: 'none' }}
              ref={el => (fileInputRefs.current[0] = el)}
              onChange={e => onFileChange(e, 0)}
            />
          </div>
          {/* 썸네일 */}
          <div className="thumbnails-wrapper">
            <button type="button" onClick={handlePrev} disabled={thumbStartIndex === 0}>
              <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 50 }} />
            </button>
            <div className="thumbnails">
              {images.slice(1)
                .slice(thumbStartIndex, thumbStartIndex + thumbnailsPerPage)
                .map((src, idx) => {
                  const actual = thumbStartIndex + idx + 1;
                  return (
                    <div
                      key={actual}
                      className="thumbnail-wrapper"
                      onClick={() => onThumbnailClick(actual)}
                    >
                      {src
                        ? <img src={src} alt={`사진 ${actual}`} />
                        : <FontAwesomeIcon icon={faCamera} style={{ fontSize: 32, color: '#555' }} />
                      }
                      <input
                        type="file" accept="image/*" style={{ display: 'none' }}
                        ref={el => (fileInputRefs.current[actual] = el)}
                        onChange={e => onFileChange(e, actual)}
                      />
                    </div>
                  );
                })}
            </div>
            <button type="button" onClick={handleNext} disabled={thumbStartIndex >= maxStartIndex}>
              <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 50 }} />
            </button>
          </div>
        </div>

        {/* 가격 */}
        <p>
          <label htmlFor="price">가격</label>
          <input
            id="price" name="price" type="text"
            required value={formData.price}
            onChange={handleChange}
          />
        </p>

        {/* 거래방식 */}
        <p>
          <label htmlFor="trade_type">거래 방식</label>
          <select
            id="trade_type" name="trade_type" required
            value={formData.trade_type} onChange={handleChange}
          >
            <option value="">-- 선택 --</option>
            <option value="직거래">직거래</option>
            <option value="택배거래">택배거래</option>
          </select>
        </p>

        {/* 제품 상태 */}
        <p>
          <label htmlFor="condition">제품 상태</label>
          <select
            id="condition" name="condition" required
            value={formData.condition} onChange={handleChange}
          >
            <option value="">상태 선택</option>
            <option value="새상품(미개봉)">새상품(미개봉)</option>
            <option value="거의 새상품(상)">거의 새상품(상)</option>
            <option value="사용감 있는 깨끗한 상품(중)">사용감 있는 깨끗한 상품(중)</option>
            <option value="사용 흔적이 많이 있는 상품(하)">사용 흔적이 많이 있는 상품(하)</option>
          </select>
        </p>

        {/* 희망 지역 */}
        <p>
          <label htmlFor="region">희망 지역</label>
          <input
            id="region" name="region" type="text"
            placeholder="서울시 종로구 구기동"
            required value={formData.region}
            onChange={handleChange}
          />
        </p>

        {/* 배송비 */}
        <p>
          <label htmlFor="shipping_fee">배송비</label>
          <input
            id="shipping_fee" name="shipping_fee" type="text"
            required value={formData.shipping_fee}
            onChange={handleChange}
          />
        </p>

        {/* 상세 설명 */}
        <p>
          <label htmlFor="description">상세 설명</label>
          <textarea
            id="description" name="description" rows={5}
            required value={formData.description}
            onChange={handleChange}
          />
        </p>

        {/* 버튼 */}
        <div className="button-group">
          <button type="submit" className="submit-btn">등록하기</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default GoodsInsert;
