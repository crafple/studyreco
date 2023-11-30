import { Link, useNavigate } from "react-router-dom";
import { default as axios } from 'axios';
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import '../css/Edit_Name.css';
function Edit_Name() {

  interface UserToken {
    id: number,
    email: string;
  }

  const navigate = useNavigate();
  const [_id, set_Id] = useState(0);
  const [_name, set_Name] = useState("");
  const [_name_copy, set_Name_Copy] = useState("");
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
    if (_name != _name_copy) {
      set_Is_Show_Alert(1)
    } else if (_name == "") {
      set_Is_Show_Alert(2)
    } else {
      axios.put(`http://localhost:3001/edit/account/name`, {
        _id,
        _name,
      }).then(() => {
        console.log('success');
      });
      axios.put(`http://localhost:3001/update/ranking/name`, {
        _id,
        _name,
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
    <div className="Edit_Name">
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
        <div className="container-edit-name">
          <form className="edit-name-form">
            <h3>利用者登録者情報の変更</h3>
            <p>{is_show_alert == 1 ? '名前が一致していません。' : ''}</p>
            <p>{is_show_alert == 2 ? '入力欄が空白です。' : ''}</p>
            <table>
              <tr>
                <th>名前</th>
                <td><input type="name" value={_name} onChange={(e) => set_Name(e.target.value)} /></td>
              </tr>
              <tr>
                <th>名前の確認</th>
                <td><input type="name" value={_name_copy} onChange={(e) => set_Name_Copy(e.target.value)} /></td>
              </tr>
            </table>
            <button className="edit-name-submit-btn" onClick={handleSubmit}>送信する</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Edit_Name;