'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h1>서버 오류가 발생했습니다</h1>
      <button onClick={() => reset()}>
        다시 시도
      </button>
    </div>
  );
}