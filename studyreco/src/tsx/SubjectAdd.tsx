import axios from "axios";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/SubjectsAdd.css';

function SubjectAdd() {

  type Subject = {
    id: number,
    subjects: string,
    times: string
  }

  interface UserToken {
    id: number,
    email: string;
  }

  const navigate = useNavigate();
  const [subject_name, setSubject_Name] = useState('');
  const [_id, setId] = useState(0);
  const [subjectList, setSubjectsList] = useState<Subject[]>([]);

  // jwtの認証
  useEffect(() => {
    axios.get('http://localhost:3001/getjwt', { withCredentials: true }).then((res) => {
      if (res.data == "fail") navigate("/Login");
      console.log("jwt");
      console.log(res.data);
      const token = res.data.jwt;
      const decoded_token = jwtDecode<UserToken>(token);
      setId(decoded_token.id);
    })
  }, [])

  useEffect(() => {
    axios.get("http://localhost:3001/get/subjects", { withCredentials: true, params: { id: _id } }).then((res) => {
      setSubjectsList(res.data);
      console.log(res.data);
    });
  }, [_id]);

  async function handleAdd(e: { preventDefault: () => void; }) {
    const _subjects = subjectList[0].subjects + ',' + subject_name;
    const _times = subjectList[0].times + ',' + '0';
    console.log(_subjects);
    if (subjectList[0].subjects == "未設定") {
      //初期設定の場合は、前回の科目名を含まないでsubject_nameだけを使用する。
      console.log("初期設定です")
      await axios.get(`http://localhost:3001/subject/add`, { withCredentials: true, params: { id: _id, subjects: subject_name, times: '0' } }).then(() => {
        console.log('成功しました');
      });
    } else {
      await axios.get(`http://localhost:3001/subject/add`, { withCredentials: true, params: { id: _id, subjects: _subjects, times: _times } }).then(() => {
        console.log('成功しました');
      });

    }
    e.preventDefault();
  };

  function handleLogout() {
    axios.get('http://localhost:3001/logout', { withCredentials: true }).then((res) => {
      console.log(res.data);
    })
    navigate("/Login")
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
    <div className="SubjectAdd">
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
        <div className="subject-add-container">
          <form className="subjectadd-form" >
            <h3>科目追加</h3>
            <table>
              <tr>
                <th>科目名を入力</th>
                <td><input value={subject_name} onChange={(e) => setSubject_Name(e.target.value)} /></td>
              </tr>
              <button className="subject-add-btn" type="submit" onClick={handleAdd}>追加する</button>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}
export default SubjectAdd;