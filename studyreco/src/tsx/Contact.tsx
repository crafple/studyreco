import { Link, useNavigate } from "react-router-dom";
import { default as axios } from 'axios';
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import '../css/Contact.css';

function Contact() {
  interface UserToken {
    id: number,
    email: string;
  }

  const navigate = useNavigate();
  const [_id, setId] = useState(0);
  const [_email, setEmail] = useState("");
  const [_password, setPassword] = useState("");
  const [_content, set_Content] = useState("");

  // jwtの認証
  useEffect(() => {
    axios.get('http://localhost:3001/getjwt', { withCredentials: true }).then((res) => {
      if (res.data == "fail") navigate("/Login");
      console.log("jwt");
      console.log(res.data);
      const token = res.data.jwt;
      const decoded = jwtDecode<UserToken>(token);
      console.log("decoded");
      setEmail(decoded.email);
      console.log(decoded.id);
      setId(decoded.id);
    })
  }, [])

  function handleLogout() {
    axios.get('http://localhost:3001/logout', { withCredentials: true }).then((res) => {
      console.log(res.data);
    })
    navigate("/Login")
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    axios.put(`http://localhost:3001/add/contact`, {
      _id,
      _content,
    }).then(() => {
      console.log('success');
    });

  };

  //バーガーメニューの表示・非表示の管理
  const [is_click_burger, set_Is_Click_Burger] = useState(false)
  function onClick_Burger() {
    if (is_click_burger) {
      set_Is_Click_Burger(false)
    } else {
      set_Is_Click_Burger(true)
    }
  }

  return (
    <div className="Contact">
      <header>
        <div className={'burger'} onClick={onClick_Burger}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <Link to="/" style={{ textDecoration: "none" }}><p className="logo">Studyreco+</p></Link>
        <nav>
          <ul className={`ul_menu ${is_click_burger ? "menu-active" : ""}`}>
            <Link to="/" style={{ textDecoration: "none" }}><li>ホーム</li></Link>
            <Link to="/Profile" style={{ textDecoration: "none" }}><li>プロフィール</li></Link>
            <Link to="/Ranking" style={{ textDecoration: "none" }}><li>ランキング</li></Link>
            <Link to="/StudyRooms" style={{ textDecoration: "none" }}><li>自習室</li></Link>
            <Link to="/Contact" style={{ textDecoration: "none" }}><li>お問い合わせ</li></Link>
            <li><button className='login_btn' onClick={handleLogout}>ログアウト</button></li>
          </ul>
        </nav>
      </header>

      <div id="main">
        <div className="contact-container">
          <form className="contact-form" onSubmit={handleSubmit} >
            <h3>お問い合わせ</h3>
            <table>
              <tr>
                <th>内容</th>
                <td><textarea value={_content} onChange={(e) => set_Content(e.target.value)} className="contact-textarea"></textarea></td>
              </tr>
              <input type="submit" value="送信する" className="contact-submit-btn" />
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
