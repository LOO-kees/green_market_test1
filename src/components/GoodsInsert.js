// components/GoodsInsert.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/GoodsInsert.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function GoodsInsert() {
  const navigate = useNavigate();

  // 로그인 체크: 토큰이 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    const raw = localStorage.getItem('token');
    if (!raw) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  }, [navigate]);

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    title: '',
    kind: '',
    brand: '',
    price: '',
    tradeType: '',
    condition: '',
    region: '',
    description: '',
    shipping_fee: ''
  });

  // 이미지 미리보기 & 파일 저장
  const [images, setImages] = useState(Array(7).fill(''));
  const [imageFiles, setImageFiles] = useState({});
  const fileInputRefs = useRef([]);

  // 썸네일 슬라이드
  const [thumbStartIndex, setThumbStartIndex] = useState(0);
  const getThumbnailsPerPage = (w) => (w >= 1024 ? 6 : w >= 768 ? 6 : 3);
  const [thumbnailsPerPage, setThumbnailsPerPage] = useState(getThumbnailsPerPage(window.innerWidth));
  useEffect(() => {
    const onResize = () => setThumbnailsPerPage(getThumbnailsPerPage(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const thumbnailCount = images.length - 1;
  const maxStartIndex = Math.max(thumbnailCount - thumbnailsPerPage, 0);
  useEffect(() => {
    setThumbStartIndex((prev) => Math.min(prev, maxStartIndex));
  }, [thumbnailsPerPage, maxStartIndex]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onThumbnailClick = (i) => fileInputRefs.current[i]?.click();

  const onFileChange = (e, i) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages((prev) => {
        const copy = [...prev];
        copy[i] = reader.result;
        return copy;
      });
    };
    reader.readAsDataURL(file);
    setImageFiles((prev) => ({ ...prev, [i]: file }));
  };

  const handlePrev = () => setThumbStartIndex((p) => Math.max(p - 1, 0));
  const handleNext = () => setThumbStartIndex((p) => Math.min(p + 1, maxStartIndex));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, kind, brand, price, tradeType, condition, region, description, shipping_fee } = formData;
    // 필수 입력 검증
    if (!title || !kind || !brand || !price || !tradeType || !condition || !region || !description || !shipping_fee) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (isNaN(price) || isNaN(shipping_fee)) {
      alert('가격과 배송비는 숫자로 입력해주세요.');
      return;
    }

    // 토큰 꺼내기 & 따옴표 제거
    const raw = localStorage.getItem('token');
    if (!raw) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    const token = raw.replace(/^"|"$/g, '');

    // FormData 구성
    const fd = new FormData();
    fd.append('title', title);
    fd.append('brand', brand);
    fd.append('kind', kind);
    fd.append('price', price);
    fd.append('trade_type', tradeType);
    fd.append('condition', condition);
    fd.append('region', region);
    fd.append('description', description);
    fd.append('shipping_fee', shipping_fee);
    Object.entries(imageFiles).forEach(([idx, file]) => {
      const field = idx === '0' ? 'image_main' : `image_${idx}`;
      fd.append(field, file);
    });

    try {
      await axios.post(
        'https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app/greenmarket/products',
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}` // Content-Type은 생략 (axios가 boundary 자동 설정)
          }
        }
      );
      alert('상품이 정상적으로 등록되었습니다!');
      navigate('/productpage');
    } catch (err) {
      console.error('상품 등록 오류:', err.response?.data || err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`등록 실패: ${msg}`);
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
            type="text"
            id="title"
            name="title"
            placeholder="안 쓰는 물건 팔아요"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </p>

        {/* 카테고리 */}
        <p>
          <label htmlFor="kind">카테고리</label>
          <select id="kind" name="kind" value={formData.kind} onChange={handleChange} required>
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
          <select id="brand" name="brand" value={formData.brand} onChange={handleChange} required>
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
          <div className="main-photo" onClick={() => onThumbnailClick(0)}>
            {images[0] ? (
              <img src={images[0]} alt="상품 메인 이미지" />
            ) : (
              <FontAwesomeIcon icon={faCamera} size="3x" />
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={(el) => (fileInputRefs.current[0] = el)}
              onChange={(e) => onFileChange(e, 0)}
            />
          </div>
          <div className="thumbnails-wrapper">
            <button type="button" onClick={handlePrev} disabled={thumbStartIndex === 0}>
              <FontAwesomeIcon icon={faChevronLeft} size="2x" />
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
                      {src ? (
                        <img src={src} alt={`미리보기 ${actual}`} />
                      ) : (
                        <FontAwesomeIcon icon={faCamera} size="2x" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={(el) => (fileInputRefs.current[actual] = el)}
                        onChange={(e) => onFileChange(e, actual)}
                      />
                    </div>
                  );
                })}
            </div>
            <button type="button" onClick={handleNext} disabled={thumbStartIndex >= maxStartIndex}>
              <FontAwesomeIcon icon={faChevronRight} size="2x" />
            </button>
          </div>
        </div>

        {/* 가격 */}
        <p>
          <label htmlFor="price">가격</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </p>

        {/* 거래 방식 */}
        <p>
          <label htmlFor="tradeType">거래 방식</label>
          <select
            id="tradeType"
            name="tradeType"
            value={formData.tradeType}
            onChange={handleChange}
            required
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
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
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
            type="text"
            id="region"
            name="region"
            placeholder="서울시 종로구 구기동"
            value={formData.region}
            onChange={handleChange}
            required
          />
        </p>

        {/* 배송비 */}
        <p>
          <label htmlFor="shipping_fee">배송비</label>
          <input
            type="text"
            id="shipping_fee"
            name="shipping_fee"
            placeholder="2000(원)"
            value={formData.shipping_fee}
            onChange={handleChange}
            required
          />
        </p>

        {/* 상세 설명 */}
        <p>
          <label htmlFor="description">상세 설명</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </p>

        {/* 버튼 */}
        <div className="button-group">
          <button type="submit" className="submit-btn">
            등록하기
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default GoodsInsert;
