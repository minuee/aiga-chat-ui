import { SessionType,GroupedSessionsType } from "@/types/types";
import functions from "@/utils/functions";

export default function groupSessionsByDateSorted(sessions: SessionType[]): GroupedSessionsType {
    const groupedMap: { [date: string]: SessionType[] } = {};
  
    // 그룹핑
    sessions.forEach((session) => {
        const date = !functions.isEmpty(session.updateAt) ? session.updateAt.split('T')[0] :  session.session_time.split('T')[0]; // 'YYYY-MM-DD'
        if (!groupedMap[date]) {
            groupedMap[date] = [];
        }
        groupedMap[date].push(session);
    });
  
    // 객체를 배열로 변환 후 날짜 정렬 (내림차순: 최신이 먼저)
    const sortedArray: GroupedSessionsType = Object.entries(groupedMap)
    .map(([date, sessions]) => ({
        date,
        sessions,
    }))
    .sort((a, b) => b.date.localeCompare(a.date)); // 날짜 내림차순
  
    return sortedArray;
}  