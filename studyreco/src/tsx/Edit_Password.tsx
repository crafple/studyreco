import { Link, useNavigate } from "react-router-dom";
import { default as axios } from 'axios';
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import '../css/Edit_Password.css';
import { sha512 } from "js-sha512";

function Edit_Password() {

  const navigate = useNavigate();
  interface UserToken {
    id: number,
    email: string;
  }

  const [_id, set_Id] = useState(0);
  const [_email, set_Email] = useState("");
  const [_password, set_Password] = useState("");
  const [_password_copy, set_Password_Copy] = useState("");
  const [is_show_alert, set_Is_Show_Alert] = useState(0);

  var _hash_password = ""

  // jwtの認証
  useEffect(() => {
    axios.get('http://localhost:3001/getjwt', { withCredentials: true }).then((res) => {
      if (res.data == "fail") navigate("/Login");

      console.log("jwt");
      console.log(res.data);
      const token = res.data.jwt;
      const decoded = jwtDecode<UserToken>(token);
      console.log("decoded");
      set_Email(decoded.email);

      console.log(decoded.id);
      set_Id(decoded.id);
    })
  }, [])

  function hash_Password() {
    _hash_password = sha512(_password)
    console.log(_hash_password)
  }

  function connect_DB() {
    console.log(_hash_password)
    console.log("connect_DB")
    axios.put(`http://localhost:3001/edit/account/password`, { withCredentials: true, _id, _hash_password }).then(() => {
      console.log('success');
    });
  }

  function handleLogout() {
    axios.get('http://localhost:3001/logout', { withCredentials: true }).then((res) => {

      console.log(res.data);
    })
    navigate("/Login")
  };

  function handleSubmit() {
    hash_Password()
    if (_password != _password_copy) {
      set_Is_Show_Alert(1)

    } else if (_password == "") {
      set_Is_Show_Alert(2)
    } else {
      connect_DB()
      set_Is_Show_Alert(0)
    }
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
    <div className="Account_Edit">
      <header>
        <div className={'burger'} onClick={onClick_Burger}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <Link to="/" style={{ textDecoration: "none" }}><p className="logo">Studyreco+</p></Link>
        <nav>
          <ul className={`ul_menu ${is_click_burger ? "menu-active" : ""}`}>
            <li>ホーム</li>
            <Link to="/Profile" style={{ textDecoration: "none" }}><li>プロフィール</li></Link>
            <Link to="/Ranking" style={{ textDecoration: "none" }}><li>ランキング</li></Link>
            <Link to="/StudyRooms" style={{ textDecoration: "none" }}><li>自習室</li></Link>
            <Link to="/Contact" style={{ textDecoration: "none" }}><li>お問い合わせ</li></Link>
            <li><button className='login_btn' onClick={handleLogout}>ログアウト</button></li>
          </ul>
        </nav>
      </header>

      <div id="main">
        <div className="edit-password-container">
          <form className="edit-password-form">
            <h3>利用者登録者情報の変更</h3>
            <p>{is_show_alert == 1 ? 'パスワードが一致していません。' : ''}</p>
            <p>{is_show_alert == 2 ? '入力欄が空白です。' : ''}</p>
            <table>
              <tr>
                <th>パスワード</th>
                <td><input type="password" value={_password} onChange={(e) => set_Password(e.target.value)} /></td>
              </tr>
              <tr>
                <th>パスワードの確認</th>
                <td><input type="password" value={_password_copy} onChange={(e) => set_Password_Copy(e.target.value)} /></td>
              </tr>
            </table>
            <button className="edit-password-submit-btn" onClick={handleSubmit}>送信する</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Edit_Password;