<?php

class PHP_Email_Form
{
    private $to;
    private $from_name;
    private $from_email;
    private $subject;
    private $smtp;

    public function __construct()
    {
        $this->to = 'levanthang230902@gmail.com'; // Địa chỉ email của người nhận
        $this->from_name = 'Thang'; // Tên người gửi
        $this->from_email = 'thangcatre230903@gmail.com'; // Email người gửi
        $this->subject = 'Hỏi xe'; // Tiêu đề email
        $this->smtp = array(); // Thông tin SMTP nếu muốn sử dụng
    }

    public function send()
    {
        if (!empty($this->to) && !empty($this->from_name) && !empty($this->from_email) && !empty($this->subject)) {
            $headers = "From: {$this->from_name} <{$this->from_email}>" . "\r\n";
            $headers .= "Reply-To: {$this->from_email}" . "\r\n";
            $headers .= "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

            if (!empty($this->smtp)) {
                $this->smtp_send($headers);
            } else {
                $message = '';
                foreach ($_POST as $key => $value) {
                    $message .= $key . ': ' . $value . "<br>";
                }
                return mail($this->to, $this->subject, $message, $headers);
            }
        } else {
            return false;
        }
    }

    private function smtp_send($headers)
    {
        $smtp_host = $this->smtp['smtp.gmail.com'];
        $smtp_username = $this->smtp['levanthang230902@gmail.com'];
        $smtp_password = $this->smtp['dkuziolgxlayhyvj'];
        $smtp_port = $this->smtp['587 '];

        $transport = (new Swift_SmtpTransport($smtp_host, $smtp_port))
            ->setUsername($smtp_username)
            ->setPassword($smtp_password);

        $mailer = new Swift_Mailer($transport);

        $message = (new Swift_Message($this->subject))
            ->setFrom([$this->from_email => $this->from_name])
            ->setTo($this->to)
            ->setBody($_POST['message'], 'text/html');

        $result = $mailer->send($message);
        return $result;
    }

    public function add_message($value, $label)
    {
        $_POST[$label] = $value;
    }
}
