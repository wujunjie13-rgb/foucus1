# foucus1

专注力应用 - Focus Timer Application

## 功能 (Features)

这是一个帮助提升专注力的应用程序，提供环境白噪音以提高工作效率。

This is a focus enhancement application that provides ambient white noise to improve productivity.

## 声音变更 (Sound Update)

**版本更新**: 已将背景音从电视静音更改为飞机舱内环境音

**Version Update**: Background sound changed from TV static to airplane cabin ambient sound

### 为什么选择飞机声音？(Why Airplane Sound?)

- 飞机舱内的环境音更加稳定和舒适
- 低频嗡嗡声有助于屏蔽外界干扰
- 模拟专业工作环境的声音氛围

- Airplane cabin ambient sound is more stable and comfortable
- Low-frequency hum helps mask external distractions
- Simulates a professional work environment sound atmosphere

## 使用方法 (Usage)

```bash
python focus_app.py
```

## 配置 (Configuration)

声音设置在 `config.json` 文件中配置。

Sound settings are configured in the `config.json` file.

- `sound_type`: 当前为 "airplane" (飞机)
- `ambient_type`: "airplane_cabin" (飞机舱内)
- `previous_version`: "tv_static" (旧版电视静音)