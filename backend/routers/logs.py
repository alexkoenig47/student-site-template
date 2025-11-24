"""
Log viewing endpoints for CloudWatch and Amplify logs
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import os
import boto3
from botocore.exceptions import ClientError

router = APIRouter(prefix="/api/logs", tags=["logs"])


class LogEntry(BaseModel):
    """Represents a single log entry"""
    timestamp: str
    message: str
    log_stream: Optional[str] = None


class LogResponse(BaseModel):
    """Response model for log queries"""
    log_group: str
    entries: List[LogEntry]
    next_token: Optional[str] = None


@router.get("/cloudwatch/{log_group_name}", response_model=LogResponse)
async def get_cloudwatch_logs(
    log_group_name: str,
    limit: int = Query(default=100, ge=1, le=1000, description="Maximum number of log entries to return"),
    start_time: Optional[int] = Query(default=None, description="Start time in Unix timestamp (milliseconds)"),
    end_time: Optional[int] = Query(default=None, description="End time in Unix timestamp (milliseconds)"),
    next_token: Optional[str] = Query(default=None, description="Token for pagination"),
):
    """
    Fetch logs from CloudWatch Logs
    
    Args:
        log_group_name: Name of the CloudWatch log group (e.g., /ecs/student-site)
        limit: Maximum number of log entries to return
        start_time: Start time in Unix timestamp (milliseconds). Defaults to 1 hour ago.
        end_time: End time in Unix timestamp (milliseconds). Defaults to now.
        next_token: Token for pagination (from previous response)
    """
    try:
        # Initialize CloudWatch Logs client
        logs_client = boto3.client('logs', region_name=os.getenv('AWS_REGION', 'us-east-1'))
        
        # Set default time range if not provided (last hour)
        if end_time is None:
            end_time = int(datetime.now().timestamp() * 1000)
        if start_time is None:
            start_time = int((datetime.now() - timedelta(hours=1)).timestamp() * 1000)
        
        # Prepare request parameters
        params = {
            'logGroupName': log_group_name,
            'limit': limit,
            'startTime': start_time,
            'endTime': end_time,
            'startFromHead': False,  # Get most recent logs first
        }
        
        if next_token:
            params['nextToken'] = next_token
        
        # Fetch log events
        response = logs_client.filter_log_events(**params)
        
        # Transform log events to our model
        entries = []
        for event in response.get('events', []):
            entries.append(LogEntry(
                timestamp=datetime.fromtimestamp(event['timestamp'] / 1000).isoformat(),
                message=event['message'].strip(),
                log_stream=event.get('logStreamName')
            ))
        
        # Reverse to show oldest first (most recent at bottom)
        entries.reverse()
        
        return LogResponse(
            log_group=log_group_name,
            entries=entries,
            next_token=response.get('nextToken')
        )
    
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code', 'Unknown')
        error_message = e.response.get('Error', {}).get('Message', str(e))
        
        if error_code == 'ResourceNotFoundException':
            raise HTTPException(
                status_code=404,
                detail=f"Log group '{log_group_name}' not found. Make sure the log group exists and the service has permissions to read it."
            )
        elif error_code == 'AccessDeniedException':
            raise HTTPException(
                status_code=403,
                detail="Access denied. The service role needs CloudWatch Logs read permissions."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching logs: {error_message}"
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )


@router.get("/cloudwatch/{log_group_name}/streams", response_model=List[str])
async def get_log_streams(
    log_group_name: str,
    limit: int = Query(default=50, ge=1, le=100, description="Maximum number of streams to return"),
):
    """
    Get list of log streams in a CloudWatch log group
    """
    try:
        logs_client = boto3.client('logs', region_name=os.getenv('AWS_REGION', 'us-east-1'))
        
        response = logs_client.describe_log_streams(
            logGroupName=log_group_name,
            orderBy='LastEventTime',
            descending=True,
            limit=limit
        )
        
        return [stream['logStreamName'] for stream in response.get('logStreams', [])]
    
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code', 'Unknown')
        error_message = e.response.get('Error', {}).get('Message', str(e))
        
        if error_code == 'ResourceNotFoundException':
            raise HTTPException(status_code=404, detail=f"Log group '{log_group_name}' not found")
        else:
            raise HTTPException(status_code=500, detail=f"Error fetching log streams: {error_message}")


@router.get("/amplify/{app_id}", response_model=dict)
async def get_amplify_logs_info(
    app_id: str,
):
    """
    Get information about Amplify logs
    
    Note: Amplify logs are typically accessed through the AWS Console.
    This endpoint provides information and links to view logs.
    """
    region = os.getenv('AWS_REGION', 'us-east-1')
    console_url = f"https://{region}.console.aws.amazon.com/amplify/home?region={region}#/{app_id}"
    
    return {
        "message": "Amplify logs are best viewed through the AWS Console",
        "app_id": app_id,
        "console_url": console_url,
        "instructions": [
            "1. Go to AWS Amplify Console",
            "2. Select your app",
            "3. Navigate to the 'Build history' or 'Deployments' section",
            "4. Click on a specific build to view its logs"
        ],
        "note": "Amplify build logs are stored per build and are best accessed through the console interface."
    }


