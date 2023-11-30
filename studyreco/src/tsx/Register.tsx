import axios from "axios";
import { sha512 } from "js-sha512";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/Register.css';

function Register() {

  const [_email, set_Email] = useState('');
  const [_password, set_Password] = useState('');
  const [_name, set_Name] = useState('');
  const [is_already_exist, set_Is_Already_Exist] = useState(false);
  const navigate = useNavigate();

  var _hash_password = ""

  async function handleRegister(e: { preventDefault: () => void; }) {
    e.preventDefault();
    _hash_password = sha512(_password)
    axios.get('http://localhost:3001/register', { withCredentials: true, params: { email: _email, password: _hash_password, name: _name } }).then((res) => {
      console.log(res.data)
      if (res.data == "fail") {
        console.log("登録に失敗")
        set_Is_Already_Exist(true)
      } else {
        set_Is_Already_Exist(false)
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
    <div className="Register">
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
        <div className="register-container">
          <form>
            <h3>会員登録</h3>
            <p>{is_already_exist ? '既にアカウントが存在します' : ''}</p>
            <p>メールアドレス</p>
            <div>
              <input type="email" value={_email} onChange={(e) => set_Email(e.target.value)} />
            </div>
            <div>
              <p>パスワード</p>
              <input type="password" value={_password} onChange={(e) => set_Password(e.target.value)} />
            </div>
            <div>
              <p>ニックネーム</p>
              <input value={_name} onChange={(e) => set_Name(e.target.value)} />
            </div>
            <button type="submit" onClick={handleRegister} className="register-btn2">登録する</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Register;