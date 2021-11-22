import { useRecoilState } from 'recoil';
import React ,{useEffect, useState} from 'react';
import { useStudentScoreAction } from '_actions';
import { pscoreAtom } from '_state';
import 'antd/dist/antd.css';
import { Table} from 'antd';
import { Scoreboard } from '_components/studentScoreList'

export { StudentScore };

function StudentScore(props) {
    // const [personalScore, setPersonalScore] = useRecoilState(pscoreAtom);
    const studentScoreAction = useStudentScoreAction();

    const [scoreboard, setScoreboard] = useState([]);
    const [personalScore, setPScore] = useState(null);
    const [scoreTotal, setScoreTotal] = useState({});

    useEffect(() => {
        console.log("Reconstruct SScore")
        async function abc() {
            console.log(props.vnu_id);
        if (!props.vnu_id) {
            return;
        } else {
            let newData = await studentScoreAction.getScoreByID(props.vnu_id)
   
                console.log(newData);
                setPScore(newData);
                var fetchedScore = newData.scores;
                var convertedScore =[];
    
                var CPA = 0;
                var totalCredit = 0;
                var totalScore = 0;
    
    
                fetchedScore.forEach(element => {
                    convertedScore.push({
                        subject_name : element.subject.subject_name,
                        subject_code : element.subject.subject_code,
                        credits_number : element.subject.credits_number,
                        score : element.score
                    })
                    totalCredit += element.subject.credits_number;
                    totalScore += element.subject.credits_number*element.score;
                });
               
                setScoreboard(convertedScore);
    
                CPA = ((totalScore/totalCredit)/10*4).toFixed(2);
                var state = (CPA > 2.5) ? ['Bình thường'] : ['Cảnh cáo'];
                state = (CPA < 1) ? ['Đuổi học'] : state;
    
                setScoreTotal({
                    name: newData.user_ref.name,
                    vnu_id: newData.user_ref.vnu_id,
                    total_credits : totalCredit,
                    cpa: CPA,
                    stt: state
                });

                // this.forceUpdate();
                // console.log(scoreTotal);
        }
        }
        
        abc();
    }, [props.vnu_id]);


    return (
        <div>
            <Scoreboard scoreboard={scoreboard} scoreTotal = {scoreTotal}></Scoreboard>
  
        </div>
    );
}


    // const columns = [
    //     {
    //         title: 'Tên học phần',
    //         dataIndex: 'subject_name',
    //         key: 'subject_name',
    //     },
    //     {
    //         title: 'Mã học phần',
    //         dataIndex: 'subject_code',
    //         key: 'subject_code',
    //     },
        
    //     {
    //       title: 'Số tín chỉ',
    //       dataIndex: 'credits_number',
    //       key: 'credits_number',
    //     },
    //     {
    //         title: 'Điểm hệ 10',
    //         dataIndex: 'score',
    //         key: 'score',
    //     },
    // ]

    // console.log(scoreboard);
