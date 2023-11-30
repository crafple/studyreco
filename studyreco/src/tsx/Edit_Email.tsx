import { Link, useNavigate } from "react-router-dom";
import { default as axios } from 'axios';
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import '../css/Edit_Email.css';
function Edit_Email() {
  // jwtの認証ためのトークンのインターフェース
  interface UserToken {
    id: number,
    email: string;
  }

  const navigate = useNavigate();

  const [_id, set_Id] = useState(0);
  const [_name, set_Name] = useState("");
  const [_email, set_Email] = useState("");
  const [_email_copy, set_Email_Copy] = useState("");
  const [is_show_alert, set_Is_Show_Alert] = useState(0);

  // jwtの認証
  useEffect(() => {
    axios.get('http://localhost:3001/getjwt', { withCredentials: true }).then((res) => {
      if (res.data == "fail") navigate("/Login");
      console.log("jwt");
      console.log(res.data);
      const token = res.data.jwt;
      const decoded = jwtDecode<UserToken>(token);
      console.log("decoded");
      console.log(decoded.id);
      set_Id(decoded.id);
    })
  }, [])

  function handleLogout() {
    axios.get('http://localhost:3001/logout', { withCredentials: true }).then((res) => {
      console.log(res.data);
    })
    navigate("/Login")
  };

  function handleSubmit() {
    if (_email != _email_copy) {
      set_Is_Show_Alert(1)
    } else if (_email == "") {
      set_Is_Show_Alert(2)
    } else {
      axios.put(`http://localhost:3001/edit/account/password`, {
        _id,
        _email,
      }).then(() => {
        console.log('success');
      });
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
        <div className="edit-email-container">
          <form className="edit-email-form">
            <h3>利用者登録者情報の変更</h3>
            <p>{is_show_alert == 1 ? 'メールアドレスが一致していません。' : ''}</p>
            <p>{is_show_alert == 2 ? '入力欄が空白です。' : ''}</p>
            <table>
              <tr>
                <th>メールアドレス</th>
                <td><input type="email" value={_email} onChange={(e) => set_Email(e.target.value)} /></td>
              </tr>
              <tr>
                <th>メールアドレスの確認</th>
                <td><input type="email" value={_email_copy} onChange={(e) => set_Email_Copy(e.target.value)} /></td>
              </tr>
            </table>
            <button onClick={handleSubmit} className="edit-email-submit-btn">送信する</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Edit_Email;