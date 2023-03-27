## 개요

다음 기술이 적용된 template 프로젝트

- Node.js v18
- [Typescript](https://www.typescriptlang.org/)
- [Nest](https://docs.nestjs.com/): 효율적이고 확장 가능한 서버 사이드 애플리케이션을 위한 혁신적 Node.js 프레임워크.
- [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers): docker-compose 기반의 local 개발 환경 (VSCode only)

추천 글

- [노마드 코더의 Nestjs 무료 강좌(2.3시간)](https://nomadcoders.co/nestjs-fundamentals)
- [도커 컴포즈를 활용하여 완벽한 개발 환경 구성하기](https://www.44bits.io/ko/post/almost-perfect-development-environment-with-docker-and-docker-compose)

## Nest 파일 구조

```sh
src
├── main.ts             # nest 시작 파일 (소스 분석은 여기서 시작)
├── app.module.ts       # nest root module
├── common              # feature module에서 쓰이는 공통 module/nest component
│   └── redis
│       ├── redis.config.ts
│       ├── redis.constant.ts
│       ├── redis.module.ts
│       ├── redis.service.spec.ts
│       └── redis.service.ts
├── cats                # feature module1 - mongodb 사용 예제 (/cats)
│   ├── cats.module.ts          # feature module 정의
│   ├── cats.controller.ts      # controller(router) 정의
│   ├── cats.controller.spec.ts # controller unittest
│   ├── cats.service.ts         # 비즈니스 로직 처리 service
│   ├── cats.service.spec.ts    # service unittest
│   ├── dto                     # DTO 정의
│   │   └── create-cat.dto.ts
│   └── schemas                 # Mongodb document schema 정의
│       └── cat.schema.ts
├── currency            # feature module2 - 외부 API(환율 계산) 사용 예제 (/currency)
│   └── ...
└── simple-queue        # feature module3 - Redis 사용 예제 (/queue)
    └── ...

test
├── app.e2e-spec.ts     # e2e test
└── jest-e2e.json
```

## Devcontainer 파일 구조

```sh
.devcontainer/
├── devcontainer.json   # devcontainer 설정
├── docker-compose.yml  # devcontainer.json에서 사용할 docker container 정의
├── Dockerfile          # docker-compose.yml에서 사용할 기본 Dockerfile
└── redis               # docker-compose.yml에서 사용할 개별 Dockerfile
    ├── Dockerfile
    └── redis.conf
```

## Visual Studio Code에서 local 환경 개발하기

https://code.visualstudio.com/docs/devcontainers/tutorial

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) 설치
1. VSCode에서 소스 open
1. devcontainer에서 실행 (`Cmd+Shift+P` -> `Dev Containers: Rebuild Containers`)
1. VSCode에서 소스 편집
1. VSCode terminal에서 App이나 test 실행
   - `yarn start:dev`
   - `yarn test:all`
   - `yarn ...`
1. 자동으로 설치된 VSCode Extensions (mongodb, redis)로 데이터 브라우징 가능

## WebStorm에서 local 환경 개발하기

```bash
# 개발 환경 띄우기
host$ docker-compose -f .devcontainer/docker-compose.yml up -d
host$ docker ps
CONTAINER ID   IMAGE                COMMAND                  CREATED          STATUS          PORTS                      NAMES
991038d93cbf   devcontainer-app     "docker-entrypoint.s…"   28 minutes ago   Up 28 minutes                              devcontainer-app-1
d14520421e7e   mongo:latest         "docker-entrypoint.s…"   28 minutes ago   Up 28 minutes   0.0.0.0:37017->27017/tcp   devcontainer-mongodb-1
70f00910014d   devcontainer-redis   "docker-entrypoint.s…"   28 minutes ago   Up 28 minutes   0.0.0.0:63790->6379/tcp    devcontainer-redis-1
# host 환경에서 코드 수정
...
# container에 접속해서 test 실행하기
host$ docker exec -it --workdir /workspaces/nestjs_base devcontainer-app-1 yarn test:all
# container에 접속해서 app 실행하기
host$ docker exec -it --workdir /workspaces/nestjs_base devcontainer-app-1 yarn start
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# unit & e2e
$ npm run test:all

# test coverage
$ npm run test:cov
```
