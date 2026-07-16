<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Message $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Channel broadcast: private channel per claim.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->message->claim_id),
        ];
    }

    /**
     * Data yang dikirim lewat broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id'         => $this->message->id,
            'claim_id'   => $this->message->claim_id,
            'sender_id'  => $this->message->sender_id,
            'body'       => $this->message->body,
            'created_at' => $this->message->created_at,
            'sender'     => $this->message->relationLoaded('sender') ? [
                'id'         => $this->message->sender->id,
                'nama'       => $this->message->sender->nama,
                'role'       => $this->message->sender->role,
                'foto_profil' => $this->message->sender->foto_profil,
            ] : null,
        ];
    }

    /**
     * Nama event yang diterima di frontend.
     */
    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
