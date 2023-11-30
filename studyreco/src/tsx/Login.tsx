import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sha512 } from "js-sha512";
import '../css/Login.css';

function Login() {
  const [_id, setId] = useState('');
  const [_email, setEmail] = useState('');
  const [_password, set_Password] = useState('');
  const navigate = useNavigate();

  var _hash_password = ""

  function navigateToRegister() {
    navigate('/Register');
  }

  async function handleLogin(e: { preventDefault: () => void; }) {
    e.preventDefault();
    _hash_password = sha512(_password)
    axios.get('http://localhost:3001/login', { withCredentials: true, params: { id: _id, email: _email, password: _hash_password } }).then((res) => {
      console.log(res.data)
      if (res.data == "sucsees") {
        navigate("/", { state: { id: _id, email: _email, password: _password } });
      } else {
        navigate("/Login");
      }
    })
  };

  const [is_click_burger, set_Is_Click_Burger] = useState(false)
  function onClick_Burger() {
    if (is_click_burger) {
      set_Is_Click_Burger(false)
    } else {
      set_Is_Click_Burger(true)
    }
  }

  return (
    <div className="Login">
      <header>
        <div className={'burger'} onClick={onClick_Burger}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <p className="logo">Studyreco+</p>
        <nav>
          <ul className={`ul_menu ${is_click_burger ? "menu-active" : ""}`}>
            <li>ホーム</li>
            <li>プロフィール</li>
            <li>ランキング</li>
            <li>自習室</li>
            <Link to="/Contact" style={{ textDecoration: "none" }}><li>お問い合わせ</li></Link>
          </ul>
        </nav>
      </header>
      
      <div id="main">
        <div className="login-container">
          <form>
            <h3>ログイン画面</h3>
            <p>メールアドレス</p>
            <div>
              <input type="email" value={_email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <p>パスワード</p>
              <input type="password" value={_password} onChange={(e) => set_Password(e.target.value)} />
            </div>
            <div className="login-btns">
              <button type="submit" onClick={handleLogin} className="login-btn">ログイン</button>
              <button type="submit" onClick={navigateToRegister} className="register-btn">新規会員登録</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;