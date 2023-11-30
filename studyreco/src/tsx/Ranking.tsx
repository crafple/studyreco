import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/Ranking.css';
import jwtDecode from "jwt-decode";

function Ranking() {
  interface UserToken {
    id: number,
    email: string;
  }

  type User_Rank = {
    id: number,
    name: string,
    total_time: string
  }

  const navigate = useNavigate();
  const [user_ranks_list, setUser_Rank_List] = useState<User_Rank[]>([]);
  const [_id, setId] = useState(0);

   // jwtの認証
   useEffect(() => {
    axios.get('http://localhost:3001/getjwt', { withCredentials: true }).then((res) => {
      console.log("jwt");
      console.log(res.data);
      const token = res.data.jwt;
      const decodedToken = jwtDecode<UserToken>(token);
      console.log("decoded");
      console.log(decodedToken.id);
      setId(decodedToken.id);
    })
  }, [])

  useEffect(() => {
    console.log("useEffect");
    axios.get("http://localhost:3001/get/ranking/top10", { withCredentials: true }).then((res) => {
      //ここで10以下なら仮のユーザーを10まで追加する
      const _user_ranks_list: User_Rank[] = res.data
      let length_user_ranks_list = user_ranks_list.length
      for (let i = 0; 10 - length_user_ranks_list > i; i++) {
        console.log(user_ranks_list.length);
        const tmp_user: User_Rank = {
          id: 0,
          name: '未設定',
          total_time: '-1'
        }
        _user_ranks_list.push(tmp_user)
      }
      setUser_Rank_List(_user_ranks_list);
      console.log(res.data);
    });
  }, []);

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
    <div className="Ranking">
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
        <div className="container-ranking">
          <div className='ranking-box'>
            <h3>勉強時間のランキング</h3>
            <p>時間が最低単位で表示されます。</p>
            <table className='ranking-graph'>
              <tr>
                <th>順位</th>
                <th>ユーザー名</th>
                <th>今月の勉強時間</th>
              </tr>
              {user_ranks_list.map((study_record, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{study_record.name}</td>
                  <td>{study_record.total_time == '-1' ? "-" : `${Math.round(Number(study_record.total_time) / 216000)}時間`}</td>
                  <td></td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Ranking;