#!/bin/bash
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.server:app --reload
