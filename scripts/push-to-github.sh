#!/bin/bash
# GitHub 푸시 스크립트
# 사용법: ./scripts/push-to-github.sh <GITHUB_REPO_URL>
# 예: ./scripts/push-to-github.sh https://github.com/aurumkim/lohas-architects.git

if [ -z "$1" ]; then
  echo "사용법: ./scripts/push-to-github.sh <깃허브_레포지토리_URL>"
  echo "예시: ./scripts/push-to-github.sh https://github.com/<사용자아이디>/<레포지토리이름>.git"
  exit 1
fi

REPO_URL=$1

echo "원격 저장소(origin)를 $REPO_URL 로 설정합니다..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "main 브랜치로 GitHub에 푸시합니다..."
git branch -M main
git push -u origin main

echo "GitHub 저장이 완료되었습니다!"
