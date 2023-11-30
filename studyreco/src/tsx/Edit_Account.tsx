import { Link, useNavigate } from "react-router-dom";
import { default as axios } from 'axios';
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import '../css/Edit_Account.css';
function Edit_Account() {
  interface UserToken {
    id: number,
    email: string;
  }

  const navigate = useNavigate();

  const [_id, set_Id] = useState(0);
  const [_name, set_Name] = useState("");
  const [_email, set_Email] = useState("");
  const [_password, set_Password] = useState("");

  // jwtの認証
  useEffect(() => {
    axios.get('http://localhost:3001/getjwt', { withCredentials: true }).then((res) => {
      //認証に失敗したらログインに戻る
      if (res.data == "fail") navigate("/Login");
      console.log("jwt");
      console.log(res.data);
      const token = res.data.jwt;
      const decoded = jwtDecode<UserToken>(token);
      set_Email(decoded.email);
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

  //バーガーメニューの表示・非表示の管理

  const [is_click_burger, set_Is_Click_Burger] = useState(false)

  function onClick_Burger() {
    console.log(is_click_burger)
    if (is_click_burger) {
      set_Is_Click_Burger(false)
    } else {
      set_Is_Click_Burger(true)
    }
  }


  return (
    <div className="Edit_Account">
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
        <div className="account-edit-container">
          <form className="account-edit-form">
            <h3>利用者登録者情報の変更</h3>
            <table>
              <tr>
                <th>メールアドレス</th>
                <td><Link to="/Edit_Email" style={{ textDecoration: "none" }}>メールアドレスを変更する</Link></td>
              </tr>
              <tr>
                <th>パスワード</th>
                <td><Link to="/Edit_Password" style={{ textDecoration: "none" }}>パスワードを変更する</Link></td>
              </tr>
              <tr>
                <th>名前</th>
                <td><Link to="/Edit_Name" style={{ textDecoration: "none" }}>名前を変更する</Link></td>
              </tr>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Edit_Account;