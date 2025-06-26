import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { default as jwtDecode } from 'jwt-decode';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css'; import 'swiper/css/navigation'; import 'swiper/css/pagination';
import '../style/ItemDetail.css';
import ItemCard2 from './ItemCard2';

const BASE_URL = 'https://port-0-backend-mbioc25168a38ca1.sel4.cloudtype.app';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);

  const token = localStorage.getItem('token');
  let loggedUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      loggedUserId = decoded.id;
    } catch {}
  }

  useEffect(() => {
    axios.get(`${BASE_URL}/greenmarket/products/${id}`)         // ← /greenmarket/products
      .then(res => {
        const product = res.data;
        setItem(product);
        const ownerId = product.owner_id;
        return Promise.all([
          axios.get(`${BASE_URL}/greenmarket/products?owner_id=${ownerId}&exclude_id=${id}`),
          axios.get(`${BASE_URL}/greenmarket/products?category=${product.kind}&exclude_id=${id}`)
        ]);
      })
      .then(([r2, r3]) => {
        setSellerProducts(r2.data);
        setCategoryProducts(r3.data.filter(p => !r2.data.some(sp => sp.id === p.id)));
      })
      .catch(err => {
        console.error(err);
        setItem(null);
      });
  }, [id]);

  if (!item) return <div>상품을 찾을 수 없습니다.</div>;

  const imageList = [
    item.image_main, item.image_1, item.image_2,
    item.image_3, item.image_4, item.image_5, item.image_6
  ].filter(Boolean);

  const handleDelete = () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    axios.delete(
      `${BASE_URL}/greenmarket/products/${item.id}`,           // ← /greenmarket/products
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      alert('상품이 삭제되었습니다.');
      navigate('/productpage');
    })
    .catch(() => alert('삭제 중 오류가 발생했습니다.'));
  };
  
  return (
    <>
      <div className="item_detail_wrap">
        <p className="item_category">{item.kind}</p>
        <div className="detail_top_wrap">
          <div className="detailSlide_wrap">
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop
              className="detailSlide"
            >
              {imageList.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={`${BASE_URL}/uploads/${img}`}
                    alt={`상품 이미지 ${i + 1}`}
                    className="item_detail_img"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="profile_wrap">
            <div className="seller_profile">
              <img
                src="/images/seller_img.png"
                alt="판매자"
                className="seller_profile_img"
              />
              <div className="seller_info">
                <p className="seller_id">판매자: {item.seller_name}</p>
                <p className="seller_items">
                  판매중 {item.seller_product_count}개
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="item_info">
          <p className="item_name">{item.title}</p>
          <p className="price">{item.price.toLocaleString()}원</p>
          <hr className="hr" />
          <ul className="item_status">
            <li>상품상태: {item.condition}</li>
            <li>
              배송비:{' '}
              {item.shipping_fee === 0
                ? '무료'
                : `${item.shipping_fee.toLocaleString()}원`}
            </li>
            <li>거래방식: {item.trade_type}</li>
          </ul>

          <div className="item_btns_wrap">
            <ul className="item_btns">
              <li><button className="btn_question">1:1문의</button></li>
              <li>
                <button
                  className="btn_cart"
                  onClick={() => {
                    if (!token) { alert('로그인이 필요합니다.'); navigate('/login'); return; }
                    axios
                      .post(
                        `${BASE_URL}/greenmarket/cart`,
                        { product_id: item.id },
                        { headers: { Authorization: `Bearer ${token}` } }
                      )
                      .then(() => alert('장바구니에 추가되었습니다.'))
                      .catch(error => {
                        const status = error.response?.status;
                        const msg = error.response?.data?.error || '오류가 발생했습니다.';
                        if (status === 400) alert(msg);
                        else if (status === 401) alert('로그인이 필요합니다.');
                        else alert(msg);
                      });
                  }}
                >
                  장바구니 추가
                </button>
              </li>
              <li>
                <Link to="/cart">
                  <button className="btn_buy">구매</button>
                </Link>
              </li>
            </ul>
          </div>

          {loggedUserId === item.owner_id && (
            <div className="item_manage_buttons">
              <button
                onClick={() => navigate(`/goodsedit/${item.id}`)}
                style={{ marginRight: '10px' }}
              >
                수정
              </button>
              <button onClick={handleDelete}>삭제</button>
            </div>
          )}
        </div>
      </div>

      <div className="item_textbox">
        <span className="description">상세설명</span>
        {item.description || '상세 설명이 없습니다.'}
      </div>

      <div className="seller_products_section">
        <h3>{item.seller_name}님의 다른 상품</h3>
        <ul className="product_list_grid">
          {sellerProducts.length > 0
            ? sellerProducts.map(p => (
                <ItemCard2
                  key={p.id}
                  id={p.id}
                  imgSrc={`${BASE_URL}/uploads/${p.images[0]}`}
                  brand={p.brand}
                  name={p.title}
                  price={`${p.price.toLocaleString()}원`}
                  datetime={p.datetime}
                />
              ))
            : <p>다른 상품이 없습니다.</p>}
        </ul>
      </div>

      <div className="category_products_section">
        <h3>카테고리가 같은 다른 상품</h3>
        <ul className="product_list_grid">
          {categoryProducts.length > 0
            ? categoryProducts.map(p => (
                <ItemCard2
                  key={p.id}
                  id={p.id}
                  imgSrc={`${BASE_URL}/uploads/${p.images[0]}`}
                  brand={p.brand}
                  name={p.title}
                  price={`${p.price.toLocaleString()}원`}
                  datetime={p.datetime}
                />
              ))
            : <p>다른 상품이 없습니다.</p>}
        </ul>
      </div>
    </>
  );
}

export default ItemDetail;
