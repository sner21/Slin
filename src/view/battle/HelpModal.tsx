import { Modal, Card } from 'antd';
import { FC, useEffect, useState } from 'react';
import { BattleManager } from '../../common/tatakai';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'github-markdown-css';

interface Props {
  open: boolean;
  onClose: () => void;
  mode: 'save' | 'load';
}

const HelpModal: FC<Props> = ({
  open,
  onClose,
  mode,
}) => {

  const [text, setText] = useState('')

  useEffect(() => {
    fetch('/Help.md')
      .then(r => r.text())
      .then(setText)
  }, [])
  return (
    <Modal
      title="游戏事项"
      open={open}
      onCancel={onClose}
      footer={null}
      width="80%"
      style={{ top: 20 }}
      bodyStyle={{
        maxHeight: 'calc(100vh - 200px)',
        overflow: 'auto',
        padding: '24px'
      }}
    >
      <div className="markdown-body"   style={{ 
          background: 'transparent', 
          color: 'inherit',
          '--color-canvas-default': 'transparent',
          '--color-canvas-subtle': 'rgba(175, 184, 193, 0.2)',
          '--color-border-default': '#606770'
        }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} >
          {text}
        </ReactMarkdown>
      </div>
    </Modal>
  );
};

export default HelpModal;

